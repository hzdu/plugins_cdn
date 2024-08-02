/** Social Sharing */
window.addEventListener('DOMContentLoaded', (event) => {
    tpsocialShare(document)
});

function tpsocialShare(doc){
    let socShare = doc.querySelectorAll('.tpgb-social-sharing');
    if(socShare){
        socShare.forEach((ss)=>{
            let ssList = ss.querySelector('.tpgb-social-list');
            if(ss.classList.contains('sharing-toggle')){
                if(ss.classList.contains('sharing-style-1')){
                    let ssTgl = ss.querySelector('.toggle-share');
                    ssTgl.addEventListener('click', (st)=>{
                        if(ssList.classList.contains('active')){
                            ssList.classList.remove('active')
                            slideUpFlex(ssList, 300)
                        }else{
                            ssList.classList.add('active')
                            slideDownFlex(ssList, 300)
                        }
                        if(st.currentTarget.classList.contains('menu-active')){
                            st.currentTarget.classList.remove('menu-active')
                        }else{
                            st.currentTarget.classList.add('menu-active')
                        }
                    });
                }else if(ss.classList.contains('sharing-style-2')){
                    let mainMenu = ss.querySelector('.tpgb-main-menu');
                    mainMenu.addEventListener('click', ()=>{
                        if(ssList.classList.contains('active')){
                            ssList.classList.remove('active');
                        }else{
                            ssList.classList.add('active');
                        }
                    })
                }
            }
            
        });
    }
}