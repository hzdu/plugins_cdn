document.addEventListener('DOMContentLoaded', () => {
    tpgbcanvasBg(document)
});

function tpgbcanvasBg(doc){
    let allCanvasEff = doc.querySelectorAll('.tpgb-section:not(.tpgb-section-editor),.tpgb-container-row:not(.tpgb-container-row-editor)');
    if(allCanvasEff){
        allCanvasEff.forEach((ac)=>{
            var middlecls = ac.querySelector('.tpgb-middle-layer'),
                unqid = ac.getAttribute('data-id');

            if(middlecls){
                if(middlecls.classList.contains('canvas-style-4'+unqid)){
                    var can4_color = middlecls.getAttribute('data-color');
                    particleground(middlecls, {
                        minSpeedX: 0.1,
                        maxSpeedX: 0.3,
                        minSpeedY: 0.1,
                        maxSpeedY: 0.3,
                        directionX: "center",
                        directionY: "up",
                        density: 10000,
                        dotColor: can4_color,
                        lineColor: can4_color,
                        particleRadius: 7,
                        lineWidth: 1,
                        curvedLines: false,
                        proximity: 100,
                        parallax: true,
                        parallaxMultiplier: 5,
                        onInit: function() {},
                        onDestroy: function() {}
                    });
                }
            }
        });
    }
}