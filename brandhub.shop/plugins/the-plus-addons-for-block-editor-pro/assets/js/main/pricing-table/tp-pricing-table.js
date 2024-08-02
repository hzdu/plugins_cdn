/* Pricing Table */
window.addEventListener('DOMContentLoaded', (event) => {
    tppriceTable(document)
});

function tppriceTable(doc){
    let allPriTab = doc.querySelectorAll('.tpgb-pricing-table');
    if(allPriTab){
        allPriTab.forEach((sl)=>{
            let read_more = sl.querySelector(".read-more-options"),
                ul_listing = sl.querySelectorAll(".tpgb-icon-list-item");

            /** Read More */
            if(read_more){
                var default_load = read_more.getAttribute("data-default-load");
                    ul_listing.forEach((ulist, index)=>{
                        if(index>=default_load){
                            ulist.style.display = "none";
                        }
                    });
                read_more.addEventListener('click', (e)=>{
                    e.preventDefault();
                    let readCurr = e.currentTarget;

                    var less_text = readCurr.getAttribute("data-less-text"),
                        more_text = readCurr.getAttribute("data-more-text");

                    if(readCurr.classList.contains('more')){
                        ul_listing.forEach((ulist)=>{
                            if( window.getComputedStyle(ulist).display == "none"){
                                ulist.style.display = '';
                            }
                        });

                        readCurr.classList.remove('more');
                        readCurr.classList.add('less');
                        readCurr.textContent = less_text;
                    }else if(readCurr.classList.contains('less')){
                        ul_listing.forEach((ulist, index)=>{
                            if(index>=default_load){
                                ulist.style.display = "none";
                            }
                        });

                        readCurr.classList.remove('less');
                        readCurr.classList.add('more');
                        readCurr.textContent = more_text;
                    }
                });
            }

            /** Tooltip */
            ul_listing.forEach((uli)=>{
                let id = uli.getAttribute('id'),
                    settings = uli.getAttribute("data-tooltip-opt");
                settings = JSON.parse(settings);
        
                if( settings && settings.content != '' ){
                    tippy( '#'+id , {
                        allowHTML : true,
                        content: settings.content,
                        trigger : settings.trigger,
                        maxWidth : settings.MaxWidth,
                        appendTo: document.querySelector('#'+id),
                    });
                }
            })
        });
    }
}