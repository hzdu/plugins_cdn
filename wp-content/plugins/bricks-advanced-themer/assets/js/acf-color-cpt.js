window.addEventListener('load', () => {
    setTimeout(
        () => {
            const shapeToggle = document.querySelector('div[data-name="brxc_enable_shapes"] #acf-field_6395700626ebd');
            let repeaterRows = document.querySelectorAll('.acf-field-repeater.color-repeater .acf-row:not(.acf-clone)');
            const addRow = document.querySelector('.acf-field-repeater.color-repeater .acf-actions > a[data-event="add-row"]');

            const objLight =  {
                '-l-1': 0.1,
                '-l-2': 0.2,
                '-l-3': 0.4,
                '-l-4': 0.6,
                '-l-5': 0.8,
                '-l-6': 0.9,
                '-d-1': -0.1,
                '-d-2': -0.2,
                '-d-3': -0.4,
                '-d-4': -0.6,
                '-d-5': -0.8,
                '-d-6': -0.9,
            };

            const pSBC = (percent, color) => {
                var f = parseInt(color.slice(1), 16),
                t = percent < 0 ? 0 : 255,
                p = percent < 0 ? percent * -1 : percent,
                R = f >> 16,
                G = f >> 8 & 0x00FF,
                B = f & 0x0000FF;
                return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
            };
            const createShadeColor = (input,color) => {
                arr = Object.entries(objLight);
                for (const [key, value] of arr) {
                    const finalColor = pSBC(value, color);

                    // container
                    let colorContainer = document.createElement("div");
                    colorContainer.className = 'shade-container';

                    // background
                    let colorShade = document.createElement("div");
                    colorShade.className = 'shade-color';
                    colorShade.style.backgroundColor = finalColor;

                    // label
                    let colorLabel = document.createElement("p");
                    colorLabel.textContent = finalColor;

                    //append
                    colorContainer.appendChild(colorShade);
                    colorContainer.appendChild(colorLabel);
                    input.appendChild(colorContainer);
                }
            }
            const createShadeRow = (container, color) => {
                let div = document.createElement("div");
                div.className = 'acf-field shade-wrapper';

                //Label
                let label = document.createElement("div");
                label.className = 'acf-label';
                div.appendChild(label);

                let labelInner = document.createElement("label");
                labelInner.textContent = 'Shades'
                label.appendChild(labelInner);


                //Input
                let input = document.createElement("div");
                input.className = 'acf-input';
                div.appendChild(input);

                //Colors
                createShadeColor(input,color);


                container.appendChild(div);
            };

            const activateEvents = (inputs,row) => {
                inputs.forEach( input => {
                    ['input','click','pointermove'].forEach( event => {
                        input.addEventListener( event, () => {
                            if(!shapeToggle.checked) return;
                            setTimeout(
                                () => {
                                    const color = row.querySelector('.acf-color-picker > input').value;
                                    let container = row.querySelector('td.acf-fields .acf-field.shade-wrapper');
                                    container.remove();
                                    container = row.querySelector('td.acf-fields');
                                    createShadeRow( container,color);
                                },
                            50)
                        })
                    })
                })
            }



            repeaterRows.forEach(row => {
                const container = row.querySelector('td.acf-fields');
                const inputs = row.querySelectorAll('.wp-picker-container');
                const color = row.querySelector('.acf-color-picker > input').value;
                if(!shapeToggle.checked) return;
                createShadeRow(container,color);
                activateEvents(inputs,row);
            })

            shapeToggle.addEventListener('change', () => {
                repeaterRows = document.querySelectorAll('.acf-field-repeater.color-repeater .acf-row:not(.acf-clone)');
                repeaterRows.forEach(row => {
                    if(!shapeToggle.checked) {
                        const container = row.querySelector('td.acf-fields .acf-field.shade-wrapper');

                        if (!container) return;
                        container.remove();

                    } else {
                        const container = row.querySelector('td.acf-fields');
                        const inputs = row.querySelectorAll('.wp-picker-container');
                        const input = row.querySelector('div[data-name="brxc_color_hex"] .wp-color-result');
                        const color = row.querySelector('.acf-color-picker > input').value;
                        createShadeRow(container, color);
                        activateEvents(inputs,row);
                    }
                })
            })

            addRow.addEventListener('click', () => {
                setTimeout(
                    () => {
                        repeaterRows = document.querySelectorAll('.acf-field-repeater.color-repeater .acf-row:not(.acf-clone)');
                        repeaterRows.forEach(row => {
                            if(!shapeToggle.checked) {
                                return;
                            } else {
                                let container = row.querySelector('td.acf-fields .acf-field.shade-wrapper');
                                if(container) container.remove();
                                container = row.querySelector('td.acf-fields');
                                const inputs = row.querySelectorAll('.wp-picker-container');
                                const input = row.querySelector('div[data-name="brxc_color_hex"] .wp-color-result');
                                const color = row.querySelector('.acf-color-picker > input').value;
                                createShadeRow(container, color);
                                activateEvents(inputs,row);
                            }
                        })
                    },
                50);
            })
        }, 
    10)
    
})