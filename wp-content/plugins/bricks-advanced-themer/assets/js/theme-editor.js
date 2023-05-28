window.addEventListener('DOMContentLoaded', () => {
    const obj = [    
        ['',0],
        ['-l-1',0.1],
        ['-l-2',0.2],
        ['-l-3',0.4],
        ['-l-4',0.6],
        ['-l-5',0.8],
        ['-l-6',0.9],
        ['-d-1',-0.1],
        ['-d-2',-0.2],
        ['-d-3',-0.4],
        ['-d-4',-0.6],
        ['-d-5',-0.8],
        ['-d-6',-0.9],
    ]

    const pSBC = (percent, color) => {
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }

    const getSetStyleRule = (sheetName) => {
        var stylesheet = document.querySelector('link[href*=' + sheetName + ']')
    
        if( stylesheet ){
            stylesheet = stylesheet.sheet;
        }
    
        return stylesheet
    }

    const els = document.querySelectorAll('.brxe-brxc-theme-editor');
    if (els.length < 1) return;

    const sheet = getSetStyleRule('bricks-advanced-themer');

    const sheetRule = [...sheet.cssRules].find((r) => r.selectorText === "html body");

    els.forEach(el => {
        const inputs = el.querySelectorAll('input[type="color"]');
        if (inputs.length < 1) return;
        inputs.forEach(input => {
            const label = input.dataset.label;
            const prefix = input.dataset.prefix;
            if (!label) return;
            input.addEventListener('input', (e) => {
                if (prefix) {
                    obj.forEach(el => {
                        sheetRule.style.setProperty('--' + prefix + '-' + label + el[0],pSBC(el[1], e.target.value));
                    })
                } else {
                    obj.forEach(el => {
                        sheetRule.style.setProperty('--' + label + el[0],pSBC(el[1], e.target.value));
                    }) 
                }
            })
        });
    });
});