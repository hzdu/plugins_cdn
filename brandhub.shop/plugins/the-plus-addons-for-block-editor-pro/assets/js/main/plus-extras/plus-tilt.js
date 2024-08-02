/* Global Tilt */
window.addEventListener('DOMContentLoaded', (event) => {
    tpgloTilt(document);
});

function tpgloTilt(doc){
    let allTilt = doc.querySelectorAll('.tpgb-jstilt');
    if(allTilt){
        allTilt.forEach((at)=>{
            let settings = at.getAttribute('data-tiltsetting');
            settings = JSON.parse(settings);
            VanillaTilt.init(at, {
                ...settings
            });
        });
    }
}