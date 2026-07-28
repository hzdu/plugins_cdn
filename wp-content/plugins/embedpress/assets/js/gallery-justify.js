(function () {
    var ROW_HEIGHT = Math.max(180, Math.round((window.screen && screen.height ? screen.height : 900) * 0.2));

    function sizeItem(item, image) {
        var w = image.naturalWidth;
        var h = image.naturalHeight;
        // naturalWidth is 0 while the image is still decoding (or a lazy
        // image that hasn't entered the viewport yet). Bail and let the
        // load handler size it later — never write a 0/NaN width, which is
        // what collapses the whole row in the editor preview.
        if (!w || !h) {
            return false;
        }
        var ratio = w / h;
        item.style.width = ROW_HEIGHT * ratio + 'px';
        item.style.flexGrow = ratio;
        return true;
    }

    function justifyGallery(root) {
        var scope = root && root.querySelectorAll ? root : document;
        var items = scope.querySelectorAll('.photos-gallery-justify .photo-item');

        items.forEach(function (item) {
            var image = item.querySelector('img');
            if (!image) return;

            // Lazy loading keeps off-screen images unloaded, so naturalWidth
            // stays 0 and the row collapses. The justify layout needs the real
            // ratio up front, so opt these images out of lazy loading.
            if (image.getAttribute('loading') === 'lazy') {
                image.removeAttribute('loading');
            }

            if (!sizeItem(item, image)) {
                // Not ready yet — size it once the bytes arrive. decode()
                // resolves on already-cached images too, with onload as a fallback.
                var onReady = function () { sizeItem(item, image); };
                image.addEventListener('load', onReady, { once: true });
                if (image.decode) {
                    image.decode().then(onReady).catch(function () { /* onload covers it */ });
                }
            }
        });
    }

    function init() {
        justifyGallery(document);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('load', init);

    // Elementor editor (and frontend) re-render widgets via AJAX after the
    // initial load events have already fired, so re-justify whenever a Google
    // Photos widget becomes ready.
    if (window.jQuery) {
        jQuery(window).on('elementor/frontend/init', function () {
            if (window.elementorFrontend && elementorFrontend.hooks) {
                elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) {
                    justifyGallery($scope && $scope[0] ? $scope[0] : document);
                });
            }
        });
    }

    // Catch any other late DOM injection (block editor preview, AJAX, etc.).
    if (window.MutationObserver) {
        var pending = false;
        var observer = new MutationObserver(function (mutations) {
            if (pending) return;
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].addedNodes && mutations[i].addedNodes.length) {
                    pending = true;
                    window.requestAnimationFrame(function () {
                        pending = false;
                        justifyGallery(document);
                    });
                    break;
                }
            }
        });
        var startObserver = function () {
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            }
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startObserver);
        } else {
            startObserver();
        }
    }
})();
