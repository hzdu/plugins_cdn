document.addEventListener('DOMContentLoaded', () => {
    postimageInit(document);
});

function postimageInit(doc){

    let postImg = doc.querySelectorAll('.tpgb-post-image');
    if(postImg){
        postImg.forEach((pi)=>{
            if(pi.classList.contains('post-img-bg')){
                let setting = pi.dataset.setting;
                setting = JSON.parse(setting);
                
                if (setting.imgType === 'background' && setting.imgLocation === 'section') {
                    var closestSection = pi.closest('.tpgb-section');
                    if (closestSection) {
                        closestSection.insertAdjacentHTML('afterbegin', tpOuterHTML(pi));
                    } else {
                        pi.closest('.tpgb-container-row').insertAdjacentHTML('afterbegin', tpOuterHTML(pi));
                    }
                    pi.remove();
                } else if (setting.imgType === 'background' && setting.imgLocation === 'column') {
                    var closestColumn = pi.closest('.tpgb-column');
                    if (closestColumn) {
                        closestColumn.insertAdjacentHTML('afterbegin', tpOuterHTML(pi));
                    } else {
                        pi.closest('.tpgb-container-col').insertAdjacentHTML('afterbegin', tpOuterHTML(pi));
                    }
                    pi.remove();
                }
            }

            if(pi.classList.contains('tpgb-fancy-add')){
                let BoxID = pi.dataset.id;
                let Setting = JSON.parse(pi.dataset.fancyOption);
                
                Fancybox.bind('[data-fancybox="postImg-'+BoxID+'"]',{
                    Toolbar: {
                        display: {
                            right: Setting.button,
                        },
                    }
                })
            }
        });
    }
}
function tpOuterHTML(element) {
    var wrapper = document.createElement('div');
    wrapper.appendChild(element.cloneNode(true));
    return wrapper.innerHTML;
}
