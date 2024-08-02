/**Table of Content*/
document.addEventListener('DOMContentLoaded', (event) => {
    tptablecntInit(document)
});

function tptablecntInit(doc){
    let tableContents = doc.querySelectorAll('.tpgb-table-content');
    if (tableContents) {
        tableContents.forEach(function(tableContent) {
        var settings = tableContent.dataset.settings;
        settings = JSON.parse(settings);
        if (settings.contentSelector !== undefined && settings.contentSelector !== '' && document.querySelector(settings.contentSelector)) {
            tocbot.init({
            ...settings
            });
        } else {
            tableContent.insertAdjacentHTML('beforeend', '<div class="tpgb-table-notice">Table of Content Class/Selector ID not found! Please Update "Content Selector" Option.</div>');
        }
        });

        var tableToggleWraps = document.querySelectorAll('.table-toggle-wrap');

        if (tableToggleWraps) {
            tableToggleWraps.forEach(function(tabTglwrap) {
                var defaultToggle = JSON.parse(tabTglwrap.dataset.defaultToggle);
                var width = window.innerWidth;
                let closeIcon = tabTglwrap.dataset.close.split(' '),
                    openIcon = tabTglwrap.dataset.open.split(' '),
                    toggleIcon = tabTglwrap.querySelector('.table-toggle-icon'),
                    tpTOC = tabTglwrap.querySelector('.tpgb-toc');

                if((width > 1200 && defaultToggle.md) || (width < 1201 && width >= 768 && defaultToggle.sm) || (width < 768 && defaultToggle.xs)) {
                    tabTglwrap.classList.add("active");
                    slideDownP(tpTOC, 500);
                    if(toggleIcon != null){
                        toggleIcon.classList.remove(closeIcon[0],closeIcon[1]);
                        toggleIcon.classList.add(openIcon[0],openIcon[1]);
                    }
                    
                }else{
                    tabTglwrap.classList.remove("active");
                    slideUpP(tpTOC, 500);
                    if(toggleIcon != null){
                        toggleIcon.classList.remove(openIcon[0],openIcon[1]);
                        toggleIcon.classList.add(closeIcon[0],closeIcon[1]);
                    }
                }

                let tocHead = tabTglwrap.querySelector('.tpgb-toc-heading');
                if(tocHead){
                    tocHead.addEventListener('click', function(el) {
                        var toggleWrap = el.currentTarget.closest('.table-toggle-wrap');
                        if(toggleWrap){
                            let toggleIcon = toggleWrap.querySelector('.table-toggle-icon'),
                                tpTOC = toggleWrap.querySelector('.tpgb-toc');
                
                            if (toggleWrap.classList.contains('active')) {
                                toggleWrap.classList.remove("active");
                                slideUpP(tpTOC, 500);
                                toggleIcon.classList.remove(openIcon[0],openIcon[1]);
                                toggleIcon.classList.add(closeIcon[0],closeIcon[1]);
                            } else {
                                toggleWrap.classList.add("active");
                                slideDownP(tpTOC, 500);
                                toggleIcon.classList.remove(closeIcon[0],closeIcon[1]);
                                toggleIcon.classList.add(openIcon[0],openIcon[1]);
                            }
                        }
                    });
                }
            });
        }
    }
}