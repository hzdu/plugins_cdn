
document.addEventListener('DOMContentLoaded', (event) => {
    tpadvImg(document);
  });
  
  function tpadvImg(doc){
    let creaImg = doc.querySelectorAll('.tpgb-creative-image');
    if(creaImg){
        creaImg.forEach((ci)=>{
            /**Fancybox*/
            let tpImg = ci.querySelector('.tpgb-animate-image.tpgb-fancy-add');
            if(tpImg) {
                let BoxID = tpImg.dataset.id,
                    Setting = JSON.parse(tpImg.dataset.fancyOption);

                    Fancybox.bind('[data-fancybox="fancyImg-'+BoxID+'"]',{
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