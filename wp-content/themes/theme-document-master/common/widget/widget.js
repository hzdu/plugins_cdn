/*
* @author 友人a丶
* @date 2022-08-12
* 
* */
let vm = false;//vue对象


/*
* Banner 脚本
* */
jQuery(function () {

    let $ = jQuery;
    $('body').on("click", function () {

        if ($('.widget-liquid-right #jq-tabs').length == 0 || vm) {
            return;
        }
        vm = true;//标记已加载
        $(".widget-liquid-right #jq-tabs").tabs();
    });

    /*自定义xhr对象*/
    function ajaxEventTrigger(event) {
        var ajaxEvent = new CustomEvent(event, {detail: this});
        window.dispatchEvent(ajaxEvent);
    }

    var oldXHR = window.XMLHttpRequest;

    function newXHR() {
        var realXHR = new oldXHR();
        realXHR.addEventListener('abort', function () {
            ajaxEventTrigger.call(this, 'ajaxAbort');
        }, false);
        realXHR.addEventListener('error', function () {
            ajaxEventTrigger.call(this, 'ajaxError');
        }, false);
        realXHR.addEventListener('load', function () {
            ajaxEventTrigger.call(this, 'ajaxLoad');
        }, false);
        realXHR.addEventListener('loadstart', function () {
            ajaxEventTrigger.call(this, 'ajaxLoadStart');
        }, false);
        realXHR.addEventListener('progress', function () {
            ajaxEventTrigger.call(this, 'ajaxProgress');
        }, false);
        realXHR.addEventListener('timeout', function () {
            ajaxEventTrigger.call(this, 'ajaxTimeout');
        }, false);
        realXHR.addEventListener('loadend', function () {
            ajaxEventTrigger.call(this, 'ajaxLoadEnd');
            $(".widget-liquid-right #jq-tabs").tabs();
        }, false);
        realXHR.addEventListener('readystatechange', function () {
            ajaxEventTrigger.call(this, 'ajaxReadyStateChange');
        }, false);
        return realXHR;
    }

    window.XMLHttpRequest = newXHR;

})
