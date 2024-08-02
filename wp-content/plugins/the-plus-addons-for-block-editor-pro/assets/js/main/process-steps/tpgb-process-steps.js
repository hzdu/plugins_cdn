/** Process Steps */
document.addEventListener('DOMContentLoaded', (event) => {
	tpproStep(document);
});
function tpproStep(doc){
    let processSteps = doc.querySelectorAll('.tpgb-process-steps');
    if(processSteps){
        processSteps.forEach((self) => {
            let data_eventtype = self.getAttribute('data-eventtype'),
                data_conn = self.getAttribute('data-connection'),
                wrapper = self.querySelectorAll(".tpgb-p-s-wrap");
            wrapper.forEach((self) => {
                if(data_conn!='' && data_conn!=undefined){
                    if(data_eventtype == "con_pro_hover"){
                        self.addEventListener('mouseover', (event) => {
                            processFun(wrapper);
                            self.classList.add('active');
                        })
                    }else{
                        self.addEventListener('click', (event) => {
                            processFun(wrapper);
                            self.classList.add('active');
                        })
                    }
                }
            });
            if(self.classList.contains('style-2')){
                var w = document.body.clientWidth,
                    tabletRes = self.classList.contains('verticle-tablet');
                if((w >= 768 && !tabletRes) || (tabletRes && w>=1024)){
                    setWidth(wrapper,self);
                    window.addEventListener('resize', function() {
                        setWidth(wrapper,self);
                    });
                }
            }
        });
    }
}
function setWidth(wrapper,self){
    var total_item = wrapper.length,
		divWidth = self.offsetWidth,
		margin = total_item * 20;
    
    var new_divWidth = divWidth - margin;
    var per_box_width = new_divWidth / total_item;
    wrapper.forEach((ww) => {
        ww.style.width = per_box_width+'px';
    });
}
function processFun(wrapper){
    wrapper.forEach((self) => {
        if(self.classList.contains('active')){
            self.classList.remove('active');
        }
    });
}