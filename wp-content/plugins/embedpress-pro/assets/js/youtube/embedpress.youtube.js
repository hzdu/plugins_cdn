(function(window, document, $, undefined) {
    "use strict";

    $(document).ready(function() {
        $(window.EmbedPress).on('EmbedPress.afterEmbed', function(e, embed) {
            if (embed.meta && embed.meta.provider_name && embed.meta.provider_name.toLowerCase() === "youtube") {
                // handle youtube specific stuff
            }
        });
    });
})(window, window.document, jQuery);
