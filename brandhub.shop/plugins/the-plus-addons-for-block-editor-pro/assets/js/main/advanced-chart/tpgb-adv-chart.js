/** Chart Js */
document.addEventListener('DOMContentLoaded', (event) => {
    tpadvChart(document)
});

function tpadvChart(doc){
    let allChart = doc.querySelectorAll('.tpgb-advanced-chart');
    if(allChart){
        allChart.forEach((ac)=>{
            let canvas = ac.querySelector('canvas'),
                data_settings = JSON.parse(ac.getAttribute('data-settings')),
                unchange_data = JSON.parse(ac.getAttribute('data-settings')),
                data_prepost = JSON.parse(ac.getAttribute('data-prepost'));

                let labelC = (unchange_data.options.scales && unchange_data.options.scales.yAxes && unchange_data.options.scales.yAxes[0].ticks.fontColor) ? unchange_data.options.scales.yAxes[0].ticks.fontColor : '#000';
                let labelS = (unchange_data.options.scales && unchange_data.options.scales.yAxes && unchange_data.options.scales.yAxes[0].ticks.fontSize) ? unchange_data.options.scales.yAxes[0].ticks.fontSize : '#000';
            if(data_prepost && data_prepost.xPrePost){
                let xPreText = (data_prepost.xPreText) ? data_prepost.xPreText : '',
                    xPostText = (data_prepost.xPostText) ? data_prepost.xPostText : '';
                data_settings.options.scales.xAxes[0].ticks = {callback: function(val, index, ticks) { 
                    return xPreText+val+xPostText 
                }, fontColor: labelC, fontSize: labelS};
            }
            if(data_prepost && data_prepost.yPrePost){
                let yPreText = (data_prepost.yPreText) ? data_prepost.yPreText : '',
                    yPostText = (data_prepost.yPostText) ? data_prepost.yPostText : '';
                data_settings.options.scales.yAxes[0].ticks = {callback: function(val, index, ticks) { 
                    return yPreText+val+yPostText
                 }, fontColor: labelC, fontSize: labelS};
            }
            if(data_settings){
                waypoint = new Waypoint({
                    element: canvas,
                    handler: function () {
                        if(!ac.classList.contains('chart-active')) {
                            var ctx = canvas.getContext('2d');
                            new Chart(ctx,data_settings);   
                            ac.classList.add('chart-active');
                        }
                    },
                    offset: 'bottom-in-view'
                });
            }
        });
    }
}