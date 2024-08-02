document.addEventListener('DOMContentLoaded', () => {
    tpgbcanvasParti(document)
}); 

function tpgbcanvasParti(doc){
    let allCanvas = doc.querySelectorAll('.tpgb-section:not(.tpgb-section-editor),.tpgb-container-row:not(.tpgb-container-row-editor)');
    if(allCanvas){
        allCanvas.forEach((ac)=>{
            var middlecls = ac.querySelector('.tpgb-middle-layer'),
                uid = ac.getAttribute('data-id');
            if(middlecls){
                if(middlecls.classList.contains('canvas-style-2'+uid)){
                    var can2_color = middlecls.getAttribute('data-color');
                    particlesJS("canvas-style-2"+uid,{particles:{number:{value:80,density:{enable:!0,value_area:800}},color:{value:can2_color},shape:{type:"circle",stroke:{width:0,color:"#000000"},polygon:{nb_sides:5},image:{src:"img/github.svg",width:100,height:100}},opacity:{value:.5,random:!1,anim:{enable:!1,speed:1,opacity_min:.1,sync:!1}},size:{value:2,random:!0,anim:{enable:!1,speed:40,size_min:.1,sync:!1}},line_linked:{enable:!0,distance:150,color:can2_color,opacity:.4,width:1},move:{enable:!0,speed:2,direction:"none",random:!1,straight:!1,out_mode:"out",bounce:!1,attract:{enable:!1,rotateX:600,rotateY:1200}}},interactivity:{detect_on:"canvas",events:{onhover:{enable:!0,mode:"grab"},onclick:{enable:!0,mode:"push"},resize:!0},modes:{grab:{distance:150,line_linked:{opacity:1}},bubble:{distance:400,size:40,duration:2,opacity:8,speed:3},repulse:{distance:200,duration:.4},push:{particles_nb:4},remove:{particles_nb:2}}},retina_detect:!0});
                }
                if(middlecls.classList.contains('canvas-style-3'+uid)){
                    var can3_color = middlecls.getAttribute('data-color');
                    particlesJS("canvas-style-3"+uid,{particles:{number:{value:600,density:{enable:!0,value_area:800}},color:{value:can3_color},shape:{type:"circle",stroke:{width:0,color:"#000000"},polygon:{nb_sides:5},image:{src:"",width:100,height:100}},opacity:{value:0,random:!1,anim:{enable:!1,speed:0,opacity_min:0,sync:!1}},size:{value:3,random:!0,anim:{enable:!1,speed:40,size_min:.1,sync:!1}},line_linked:{enable:!0,distance:32.068241,color:can3_color,opacity:.8,width:1},move:{enable:!0,speed:4,direction:"none",random:!1,straight:!1,out_mode:"out",bounce:!1,attract:{enable:!1,rotateX:600,rotateY:1200}}},interactivity:{detect_on:"canvas",events:{onhover:{enable:true,mode:"repulse"},onclick:{enable:!1,mode:"push"},resize:!0},modes:{grab:{distance:400,line_linked:{opacity:1}},bubble:{distance:200,size:140,duration:2,opacity:8,speed:2},repulse:{distance:100,duration:.4},push:{particles_nb:4},remove:{particles_nb:2}}},retina_detect:!0});
                }
                if(middlecls.classList.contains('canvas-style-5'+uid)){
                    var can5color = middlecls.getAttribute('data-color'),
                        can5type = middlecls.getAttribute('data-type');
                    particlesJS("canvas-style-5"+uid,{ particles:{number:{value:80,density:{enable:true,value_area:800}},color:{value:can5color},shape:{type:can5type,stroke:{width:4,color:can5color},polygon:{nb_sides:8},image:{src:"img/github.svg",width:100,height:100}},opacity:{value:0.5,random:false,anim:{enable:false,speed:1,opacity_min:0.1,sync:false}},size:{value:2,random:true,anim:{enable:false,speed:102.321728,size_min:25.174393,sync:true}},line_linked:{enable:true,distance:150,color:can5color,opacity:0.4,width:1},move:{enable:true,speed:6,direction:"none",random:false,straight:false,out_mode:"out",bounce:false,attract:{enable:false,rotateX:600,rotateY:1200}}},interactivity:{detect_on:"canvas",events:{onhover:{enable:false,mode:"grab"},onclick:{enable:true,mode:"push"},resize:true},modes:{grab:{distance:923.076923,line_linked:{opacity:1}},bubble:{distance:287.712287,size:40,duration:3.916083,opacity:1,speed:3},repulse:{distance:200,duration:0.4},push:{particles_nb:4},remove:{particles_nb:2}}},retina_detect:true } );
                }
                if(middlecls.classList.contains('canvas-style-6'+uid)){
                    var can6color = middlecls.getAttribute('data-color'),
                        can6type = middlecls.getAttribute('data-type');
                    particlesJS("canvas-style-6"+uid, { particles:{number:{value:10,density:{enable:true,value_area:800}},color:{value:can6color},shape:{type:can6type,stroke:{width:0,color:can6color},polygon:{nb_sides:5},image:{src:"img/github.svg",width:100,height:100}},opacity:{value:0.505074,random:true,anim:{enable:false,speed:1,opacity_min:0.1,sync:false}},size:{value:100.213253,random:true,anim:{enable:true,speed:10,size_min:40,sync:false}},line_linked:{enable:false,distance:481.023618,color:can6color,opacity:1,width:2},move:{enable:true,speed:8,direction:"none",random:false,straight:false,out_mode:"out",bounce:false,attract:{enable:false,rotateX:600,rotateY:1200}}},interactivity:{detect_on:"canvas",events:{onhover:{enable:false,mode:"bubble"},onclick:{enable:false,mode:"push"},resize:true},modes:{grab:{distance:431.568431,line_linked:{opacity:0.364281}},bubble:{distance:263.73626373626377,size:55.944055,duration:2.157842,opacity:0.335664,speed:3},repulse:{distance:239.760239,duration:0.4},push:{particles_nb:4},remove:{particles_nb:2}}},retina_detect:true} );
                }
                if(middlecls.classList.contains('canvas-style-7'+uid)){
                    var can7color = middlecls.getAttribute('data-color'),
                        can7type = middlecls.getAttribute('data-type');
                    particlesJS("canvas-style-7"+uid, { particles:{number:{value:400,density:{enable:true,value_area:2840.9315098761817}},color:{value:can7color},shape:{type:can7type,stroke:{width:0,color:can7color},polygon:{nb_sides:5},image:{src:"img/github.svg",width:100,height:100}},opacity:{value:0.5,random:true,anim:{enable:false,speed:1,opacity_min:0.1,sync:false}},size:{value:11,random:true,anim:{enable:false,speed:40,size_min:0.1,sync:false}},line_linked:{enable:false,distance:224.4776885211732,color:can7color,opacity:0.1683582663908799,width:1.2827296486924182},move:{enable:true,speed:3,direction:"bottom",random:true,straight:false,out_mode:"bounce",bounce:false,attract:{enable:false,rotateX:881.8766334760375,rotateY:1200}}},interactivity:{detect_on:"canvas",events:{onhover:{enable:true,mode:"bubble"},onclick:{enable:true,mode:"repulse"},resize:true},modes:{grab:{distance:400,line_linked:{opacity:0.5}},bubble:{distance:400,size:4,duration:0.3,opacity:1,speed:3},repulse:{distance:200,duration:0.4},push:{particles_nb:4},remove:{particles_nb:2}}},retina_detect:true} );	
                }
                if(middlecls.classList.contains('canvas-style-8'+uid)){
                    var show_parti = middlecls.querySelector('.tpgb-snow-particles');
                    let rgbColor = { 'r': 255, 'g': 255, 'b': 255};
                    var can8color = middlecls.getAttribute('data-color');
                    if(can8color){
                        rgbColor = getrgbColor(can8color);
                    }
                    
                    let circles, target, animateHeader = true,
                        canvas = show_parti,
                        width = middlecls.offsetWidth,
                        height = middlecls.offsetHeight,
                        canvas_header = middlecls,
                        ctx = canvas.getContext('2d');
        
                    initHeader();
                    addListeners();
        
                    function initHeader() {
                        canvas.width = width;
                        canvas.height = height;
                        target = {
                            x: 0,
                            y: height
                        };
                        canvas_header.style.height = height + 'px';
                        circles = [];
                        for (let x = 0; x < width * 0.5; x++) {
                            let c = new Circle();
                            circles.push(c);
                        }
                        animate();
                    }
        
                    function addListeners() {
                        window.addEventListener('scroll', scrollCheck);
                        window.addEventListener('resize', resize);
                    }
        
                    function scrollCheck() {
                        if (document.body.scrollTop > height) animateHeader = false;
                        else animateHeader = true;
                    }
        
                    function resize() {
                        width = window.innerWidth;
                        height = window.innerHeight;
                        canvas_header.style.height = height + 'px';
                        canvas.width = width;
                        canvas.height = height;
                    }
        
                    function animate() {
                        if (animateHeader) {
                            ctx.clearRect(0, 0, width, height);
                            for (let i in circles) {
                                circles[i].draw();
                            }
                        }
                        requestAnimationFrame(animate);
                    }
        
        
                    function Circle() {
                        let $this = this;
                        
                        (function () {
                            $this.pos = {};
                            init();
                        })();
        
                        function init() {
                            $this.pos.x = Math.random() * width;
                            $this.pos.y = height + Math.random() * 100;
                            $this.alpha = 0.1 + Math.random() * 0.4;
                            $this.scale = 0.1 + Math.random() * 0.3;
                            $this.velocity = Math.random();
                        }
        
                        this.draw = function () {
                            if ($this.alpha <= 0) {
                                init();
                            }
                            $this.pos.y -= $this.velocity;
                            $this.alpha -= 0.0003;
                            ctx.beginPath();
                            ctx.arc($this.pos.x, $this.pos.y, $this.scale * 10, 0, 2 * Math.PI, false);
                            ctx.fillStyle = 'rgba('+rgbColor.r+','+rgbColor.g+','+rgbColor.b+',' + $this.alpha + ')';
                            ctx.fill();
                        };
                    }
                }
                if(middlecls.classList.contains('canvas-custom'+uid)){
                    var cutJson = middlecls.getAttribute('data-patijson');
                    cutJson = JSON.parse(cutJson);
                    if(cutJson){
                        particlesJS("canvas-custom"+uid, cutJson  );
                    }
                }
            }
        });
    }
}

function getrgbColor(hex){
    let rootPattern = /^var\(\s*--[\w-]+\s*\)$/;
    var rootResult = rootPattern.exec(hex);
    if(rootResult){
        let getRoot = document.querySelector(':root');
        if(getRoot){
            let varPattern = /var\(([^)]+)\)/;
            let matches = hex.match(varPattern);
            if (matches) {
                const innerBracketText = matches[1];
                let rootCSS = getComputedStyle(getRoot);
                hex = rootCSS.getPropertyValue(innerBracketText);
            }
        }
    }
    var rgbPattern = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
    var result = rgbPattern.exec(hex);
    if(result){
        return {
            r: parseInt(result[1], 10),
            g: parseInt(result[2], 10),
            b: parseInt(result[3], 10),
        };
    }else{
        var resultN = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if(resultN){
            return {
                r: parseInt(resultN[1], 16),
                g: parseInt(resultN[2], 16),
                b: parseInt(resultN[3], 16),
            };
        }
    }
}