document.addEventListener('DOMContentLoaded', (event) => {
    tpsoIcon(document);
});
  
function tpsoIcon(doc){
  
    let socIcons = doc.querySelectorAll('.tpgb-social-icons');
    if(socIcons){
        socIcons.forEach((si)=>{
            let iconTt = si.querySelectorAll('.social-icon-tooltip');
            iconTt.forEach((itt)=>{
                let id = itt.getAttribute('id'),
                    settings = itt.getAttribute('data-tooltip-opt');
                if(settings){
                    settings = JSON.parse(settings);
                    if(settings.content != ''){
                        tippy( '#'+id , {
                            allowHTML : true,
                            content: settings.content,
                            trigger : settings.trigger,
                            maxWidth : settings.MaxWidth,
                            appendTo: document.querySelector('#'+id),
                        });
                    }
                }
            });
        });
    }
  }