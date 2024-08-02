window.addEventListener('DOMContentLoaded', (event) => {
    tpmsgBox(document);
  });
  
  function tpmsgBox(doc){
    let messAll = doc.querySelectorAll('.tpgb-messagebox');
    messAll.forEach((ms)=>{
        let disBtn = ms.querySelector('.msg-dismiss-content');
        if(disBtn){
            disBtn.addEventListener('click', ()=>{
                slideUpP(ms, 500);
            })
        }
    });
}