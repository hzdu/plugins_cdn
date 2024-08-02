/* Adv Typo */
window.addEventListener('DOMContentLoaded', (event) => {
    advanceTypo(document)
});

function advanceTypo(doc){
    let advTypo = doc.querySelectorAll('.tpgb-adv-typo');
    if(advTypo){
        advTypo.forEach((at)=>{
            var typo_circular = at.querySelector('.typo_circular');
            if(typo_circular){
                var ids = typo_circular.getAttribute('id'),
                    custom_radius = typo_circular.getAttribute('data-custom-radius'),
                    custom_reversed = typo_circular.getAttribute('data-custom-reversed');

                if(custom_reversed && custom_reversed == 'yes'){
                    var circular_option = new CircleType(document.getElementById(ids)).dir(-1).radius(custom_radius);
                }else {
                    var circular_option = new CircleType(document.getElementById(ids)).radius(custom_radius);
                }
            } 
        });
    }
}