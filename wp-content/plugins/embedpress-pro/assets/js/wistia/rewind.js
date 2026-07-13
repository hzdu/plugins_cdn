/**
 * @package   OSWistia
 * @contact   www.joomlashack.com, help@joomlashack.com
 * @copyright 2016 Joomlashack.com, All rights reserved
 * @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
 */
/* global Wistia */

Wistia.plugin('rewind', function (video, options) {
    // Wait for the video element
    var interval = setInterval(function () {
        if (video.elem() != null) {
            clearInterval(interval);
            interval = null;

            function hexToRgb(hex) {
                var bigint = parseInt(hex, 16);
                var r = (bigint >> 16) & 255;
                var g = (bigint >> 8) & 255;
                var b = bigint & 255;

                return r + ',' + g + ',' + b;
            }

            function addClass(nodes, className) {
                var node, currentClassName;
                if (!nodes.length) nodes = [nodes];
                for (var n = 0; n < nodes.length; n++) {
                    node = nodes[n];
                    currentClassName = ' ' + node.className + ' ';
                    if ((currentClassName).indexOf(' ' + className + ' ') == -1) {
                        node.className += ' ' + className;
                    }
                }
            }

            function removeClass(nodes, className) {
                var node, currentClassName;
                if (!nodes.length) nodes = [nodes];
                for (var n = 0; n < nodes.length; n++) {
                    node = nodes[n];
                    currentClassName = ' ' + node.className + ' ';
                    if ((currentClassName).indexOf(' ' + className + ' ') >= 0) {
                        node.className = currentClassName.replace(' ' + className + ' ', '').trim();
                    }
                }
            }

            var playerColor = hexToRgb(video.playerColor());
            var backgroundColor = 'rgba(' + playerColor + ',0.8)';

            // Create the rewind button
            var rewindButtonWrapper = document.createElement('div');
            rewindButtonWrapper.className = 'w-control-bar__region w-control-bar__region--rewind';


            var rewindButton = document.createElement('div');

            // rewindButton.innerHTML = video.options.rewindTime + 's';
            rewindButton.className = 'rewindButton w-control w-is-visible';
            rewindButton.style.color = 'white';
            rewindButton.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAABYlAAAWJQFJUiTwAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAACaElEQVQ4EZ2VPWgUURSFZ3YTRSEE1ARBNCD+RFQIWKVXC1sVBFsLldgoVnYWCmJlKRYGSRdRUilYKaKoKHaKiEgQg4pi/AGL7Pid2Xsms5vJ7pILZ8+5P+++NzPvvU2SCsuyrOYwehTUQT/Y6XgnLga7iIG1NE0b8tHnoKuRm4IPSRNfrbqIdyYKU1egrwDZfXAzV1l22HkxsRQs31wFUTiAvgtsfyzgx+AGuADGPAG6bt3CJNx0Dfo5kP1rUtaAF0KbfiP0BJtiMcs2zhMUbgffgOwNUHM1ngYzYB7YPiLGe218JEZNwBdDb47Be/FvRUykBezp1jh/+RReB2eieBK9W9qGfx7YHiF6+miDFO5SE1gfcCB0H9rf4BLadtwTVjJV5e21ZAXk/TQ6FNoVsgeVzcpBirQPvaJiEteQ65OGjwHZDzDq/IqYBl7tRvQskB2t8aPV6GwvecRuM/k4w3PUfor6YZ3zDCyoQBN0a9SeL435G7m1+orrcXYANX7WPqibr0VFzWDwvF7yWSB77QbonlZMnd/pNvR3IDugpgdz2fzZr8bIfk/QiV0H69TJPoB1aqC78SWQ6VTkDeHqCyJmIe/tNIx+B2TXikXgnMhDzZ9JJ3C1sVt2hXzFVRP6Diz7CrZ6bM4EdPvYdBsNlQvwW94zvlbohsjspOrhej5bONrAr5QNewufAlvamo8QOw2Ut12OHosTk/E9ugF925XBn+En4B54Cr4A2y/EhCdFLzaNWYoPQ1J36UOgQVU2R1B/K8VViC4aFiIaF/+k4e+DNXAErAI/wXvwgk0/CzffYZI0Socg+Q+yHSG8hQkepQAAAABJRU5ErkJggg==')";
            rewindButton.style.backgroundRepeat = 'no-repeat';
            rewindButton.style.backgroundPosition = 'center';
            rewindButton.style.textAlign = 'center';
            rewindButton.style.fontSize = '10px';
            rewindButton.style.fontWeight = 'bold';
            rewindButton.style.paddingTop = '3px';
            rewindButton.style.boxSizing = 'border-box';
            rewindButton.style.cursor = 'pointer';
            rewindButton.style.height = '28px';
            rewindButton.innerHTML = parseInt(video.options.rewindTime);

            rewindButtonWrapper.appendChild(rewindButton);

            var parent = video.container.getElementsByClassName('w-control-bar__region--right')[0];

            if (parent !== undefined) {
                parent.insertBefore(rewindButtonWrapper, parent.firstChild);
            }

            rewindButton.addEventListener('click', function (e) {
                var newTime = parseInt(video.time() - video.options.rewindTime);

                if (newTime < 0) {
                    newTime = 0;
                }

                video.time(newTime);
            });
        }
    }, 500);

    return {
        'rewind': this
    };
});
