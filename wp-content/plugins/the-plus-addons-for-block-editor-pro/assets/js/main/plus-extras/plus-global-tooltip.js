/* Global Tooltip Start */
tpglTip(document);
function tpglTip(doc){
    let container = doc.querySelectorAll('.tpgb-global-tooltip');
    if(container){
        container.forEach( el => {
            let id = el.getAttribute('id'),
            settings = el.getAttribute("data-tooltip-opt");

            settings = JSON.parse(settings);

        if(settings!='' && settings!=undefined && settings.content != ''){
                tippy( '#'+id , {
                    allowHTML : true,
                    content: settings.content,
                    trigger : settings.trigger,
                    appendTo: document.querySelector('#'+id),
                });
            }
            
        });
    }
}

/* Global Tooltip End */