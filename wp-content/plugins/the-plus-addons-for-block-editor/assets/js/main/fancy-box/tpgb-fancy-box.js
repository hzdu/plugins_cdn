document.addEventListener("DOMContentLoaded", function() {
    tpgnbtnPopup(document)
});

function tpgnbtnPopup(doc){
    let fancyPopup = doc.querySelectorAll('.tpgb-fancy-popup');
    if(fancyPopup){
        fancyPopup.forEach((fp)=>{
            tpgb_fancy_popup(fp);
        })
    }
}

function tpgb_fancy_popup(obj) {
    obj.addEventListener('click', (e)=>{
        let src = e.currentTarget.getAttribute('data-src');
        Fancybox.bind('[data-src="'+src+'"]',{
            on: {
                ready: (fancybox) => {
                    if(fancybox.container){
                        fancybox.container.classList.add('tpgb-button-fancy')
                    }
                },
              done: (fancybox) => {
                let isotopinner = fancybox.container.querySelectorAll('.tpgb-gallery-list .post-loop-inner');
                if(isotopinner){
                    if ( typeof tppoMaso == 'function' ) {
                        tppoMaso(document)
                    }
                }
              },
            },
        })
    })
}