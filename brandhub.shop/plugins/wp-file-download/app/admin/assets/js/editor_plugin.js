(function () {
    tinymce.create('tinymce.plugins.wpfd', {
        init: function (ed, url) {
            if (jQuery().leanModal) {
                $ = jQuery;
                $('.wpfdlaunch').leanModal({
                    top: 20, beforeShow: function () {
                        $("#wpfdmodal").css("height", "90%");
                        $("#wpfdmodalframe").hide();
                        $("#wpfdmodalframe").attr('src', $("#wpfdmodalframe").data('src'));
                        $("#wpfd_loader").show();
                    }
                });
            }
        },
    });

    tinymce.PluginManager.add('wpfd', tinymce.plugins.wpfd);

})();