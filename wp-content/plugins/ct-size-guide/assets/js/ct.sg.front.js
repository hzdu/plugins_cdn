jQuery(document).ready(function ($) {

    jQuery('.open-popup-link').magnificPopup({
        type: 'inline',
        midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
        closeBtnInside: true
    });

    //add row & column highlighting on Size Display Table

    var $tables = $('.ct-table-hovers');

    $tables.each(function () {
        var $cells = $(this).find("td, th");

        $cells
            .on("mouseover", function () {
                var $this = jQuery(this),
                    $pos = $this.index();
                $this.parent().parent().addClass('ct-table-hovered');
                $this.parent().find("th, td").addClass("ct-table-hover");
                $cells.filter(":nth-child(" + ($pos + 1) + ")").addClass("ct-table-hover");
                $this.addClass("ct-table-cursor");
            })
            .on("mouseout", function () {
                var $this = jQuery(this);
                $cells.removeClass("ct-table-hover");
                $this.parent().parent().removeClass('ct-table-hovered');
                jQuery(this).removeClass("ct-table-cursor");
            });
    });
});