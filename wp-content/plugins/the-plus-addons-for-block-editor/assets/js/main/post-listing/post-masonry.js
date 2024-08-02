document.addEventListener('DOMContentLoaded', function() {
    tppoMaso(document)
});
window.addEventListener('resize', function() {
    tppoMaso(document)
});
document.addEventListener("post-load", function() {
    setTimeout(function() {
        tppoMaso(document);
    }, 800);
});
document.addEventListener("resort-isotope", function() {
    setTimeout(function() {
        tppoMaso(document);
    }, 800);
});
document.addEventListener("tabs-reinited", function() {
    setTimeout(function() {
        tppoMaso(document);
    }, 800);
});

function tppoMaso(doc){
    var tpgbIsotope = doc.querySelectorAll('.tpgb-isotope');
    if (tpgbIsotope.length > 0) {
        var b = window.theplus || {};
        b.window = window,
        b.document = document,
        b.windowHeight = window.innerHeight || document.documentElement.clientHeight,
        b.windowWidth = window.innerWidth || document.documentElement.clientWidth;   
        function tpgbIsotopePosts() {
            var rtlVal = true;
            if (document.dir == 'rtl') {
                rtlVal = false;
            }
            tpgbIsotope.forEach(function(item) {
                var e, c = item,
                d = c.getAttribute("data-layout"),
                f = {
                    itemSelector: ".grid-item",
                    resizable: true,
                    sortBy: "original-order",
                    originLeft: rtlVal
                };
                var uid = c.getAttribute("data-id");
                var inner_c = document.querySelector('.tpgb-block-' + uid + ' .post-loop-inner');
                e = "masonry" === d ? "masonry" : "fitRows",
                f.layoutMode = e;
                
                var iso = new Isotope(inner_c, f);
                iso.arrange();
            });
            
        }

        b.init = function() {
            tpgbIsotopePosts();
        };
        b.init();
    }
}