/**
 * @package   OSWistia
 * @contact   www.joomlashack.com, help@joomlashack.com
 * @copyright 2016 Joomlashack.com, All rights reserved
 * @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
 */
/* global Wistia */

Wistia.plugin("fixautoplayresumable", function(video) {

    var firstPlay = true;

    function resumableKey() {
        return [video.params.pageUrl || location.href, video.hashedId(), "resume_time"];
    }

    function resumeTime() {
        return Wistia.localStorage(resumableKey());
    }

    function play() {
        if (resumeTime() > 0 && firstPlay) {
            video.pause();
        }

        firstPlay = false;
    }

    video.bind("play", play);

    return {};
});
