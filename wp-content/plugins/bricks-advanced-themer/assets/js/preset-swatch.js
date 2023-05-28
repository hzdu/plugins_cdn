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
    const toHex = (rgb) => {
        rgb = rgb.substring(4, rgb.length-1)
         .replace(/ /g, '')
         .split(',');
        return rgbToHex(parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2]));
    }
    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('');

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

    const els = document.querySelectorAll('.brxe-brxc-preset-swatch');
    if (els.length < 1) return;

    const sheet = getSetStyleRule('bricks-advanced-themer');

    const sheetRule = [...sheet.cssRules].find((r) => r.selectorText === "html body");

    els.forEach(el => {

        const wrappers = el.querySelectorAll('.brxc-preset-swatch__wrapper');
        if (wrappers.length < 1) return;

        wrappers.forEach(wrapper =>{

            const json = JSON.parse(wrapper.dataset.target);
            if (json.length < 1) return;

            wrapper.addEventListener('click', (e) => {

                json.forEach(el => {
                    if (el[0]){
                        obj.forEach(shade => {
                            sheetRule.style.setProperty('--' + el[0] + '-' + el[1] + shade[0],pSBC(shade[1], el[2]));
                        })
                    } else {
                        obj.forEach(shade => {
                            sheetRule.style.setProperty('--' + el[1] + shade[0],pSBC(shade[1], el[2]));
                        })
                    }
                })
            });
        })
    });
});