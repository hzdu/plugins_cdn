/**
 * @package   OSWistia
 * @contact   www.joomlashack.com, help@joomlashack.com
 * @copyright 2016 Joomlashack.com, All rights reserved
 * @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
 */
/* global Wistia */

Wistia.plugin('customspeed', function(video) {
    // Does the browser supports this plugin?
    if ((typeof video.elem != 'undefined') && (video.elem() != null) && ((typeof video.elem().playbackRate) != 'undefined')) {
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

        function show(el) {
            removeClass(el, 'wistia_romulus_hidden');
            addClass(el, 'wistia_romulus_visible');
        }

        function hide(el) {
            removeClass(el, 'wistia_romulus_visible');
            addClass(el, 'wistia_romulus_hidden');
        }

        var playerColor = hexToRgb(video.playerColor());
        var backgroundColor = 'rgba(' + playerColor + ',0.8)';

        // Create the speed selector
        var playbackRateButton = document.createElement('div');
        playbackRateButton.innerHTML = '1x';
        playbackRateButton.className = 'playbackRateButton wistia_romulus_control';
        playbackRateButton.style.color = 'white';
        playbackRateButton.style.background = backgroundColor;
        playbackRateButton.style.zIndex = '1';
        playbackRateButton.style.position = 'absolute';
        playbackRateButton.style.bottom = '35px';
        playbackRateButton.style.right = '0';
        playbackRateButton.style.display = 'block';
        playbackRateButton.style.width = '50px';
        playbackRateButton.style.height = '32px';
        playbackRateButton.style.textAlign = 'center';
        playbackRateButton.style.fontSize = '15px';
        playbackRateButton.style.fontWeight = 'bold';
        playbackRateButton.style.paddingTop = '7px';
        playbackRateButton.style.boxSizing = 'border-box';
        playbackRateButton.style.cursor = 'pointer';
        video.grid.center.appendChild(playbackRateButton);

        // Create the Selector container
        var playbackRateSelector = document.createElement('div');
        playbackRateSelector.className = 'playbackRateSelector wistia_romulus_control wistia_romulus_hidden';
        playbackRateSelector.style.color = 'white';
        playbackRateSelector.style.background = 'rgba(' + playerColor + ',0.8)';
        playbackRateSelector.style.zIndex = '1';
        video.grid.center.appendChild(playbackRateSelector);

        function setPlaybackRate(speed) {
            if (typeof speed != 'undefined') {
                Wistia.localStorage('playbackRate', parseFloat(speed));
            }

            var currentRate = Wistia.localStorage('playbackRate') || 1;

            // Update the selector
            playbackRateButton.innerHTML = currentRate + 'x';

            // Set the video playback rate
            video.playbackRate(currentRate);
        }

        // Create the buttons for each speed
        var speedButton,
            speed,
            speeds = ['0.5', '0.75', '1', '1.25', '1.5', '2'],
            width = 50,
            offset = 52;

        for (var i = speeds.length-1; i >= 0 ; i--) {
            speed = speeds[i];
            speedButton = document.createElement('div');
            speedButton.innerHTML = speed + 'x';
            speedButton.className = 'playbackRateSelectorButton';
            speedButton.style.position = 'absolute';
            speedButton.style.color = 'white';
            speedButton.style.backgroundColor = backgroundColor;
            speedButton.style.zIndex = '1';
            speedButton.style.bottom = '35px';
            speedButton.style.right = offset + 'px';
            speedButton.style.display = 'inline-block';
            speedButton.style.width = width + 'px';
            speedButton.style.height = '32px';
            speedButton.style.textAlign = 'center';
            speedButton.style.fontSize = '15px';
            speedButton.style.fontWeight = 'bold';
            speedButton.style.paddingTop = '7px';
            speedButton.style.boxSizing = 'border-box';
            speedButton.style.cursor = 'pointer';
            speedButton.dataset.speed = speed;

            speedButton.addEventListener('click', function() {
                setPlaybackRate(this.dataset.speed);
                hide(playbackRateSelector);
            });

            playbackRateSelector.appendChild(speedButton);

            offset += width + 1;
        }

        // Events
        var unplayed = true;
        wistiaEmbed.bind('play', function() {
            unplayed = false;
        });

        wistiaEmbed.grid.center.addEventListener('mouseenter', function(e) {
            show(playbackRateButton);
        });

        wistiaEmbed.grid.center.addEventListener('mouseleave', function(e) {
            hide(playbackRateButton);
            hide(playbackRateSelector);
        });

        playbackRateButton.addEventListener('click', function(e) {
            // Is it visible?
            if (playbackRateSelector.className.indexOf('wistia_romulus_visible') >= 0) {
                hide(playbackRateSelector);
            } else {
                show(playbackRateSelector);
            }
        });

        window.setTimeout(function() {
            setPlaybackRate();
            hide(playbackRateButton);
        }, 500);
    }

    return {
        'setPlaybackRate': setPlaybackRate
    };
});
