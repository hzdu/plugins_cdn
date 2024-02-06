/**
 * WP File Download
 *
 * @package WP File Download
 * @author Joomunited
 * @version 1.0
 */


bytesToSize = function(bytes) {
    var sizes = [];
    if (typeof(window.wpfdHelper) !== 'undefined' && typeof(window.wpfdHelper.fileMeasure) !== 'undefined' && window.wpfdHelper.fileMeasure.length > 0) {
        sizes = window.wpfdHelper.fileMeasure;
    } else {
        sizes = ['B','KB','MB','GB','TB','PB'];
    }
    if (bytes <= 0) return 'N/A';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};