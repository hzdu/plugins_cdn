const ADMINBRXC = {
    globalSettings: {
        generalCats: [],
        keyboardShortcuts: {
        },
        disableIDStyles: false,
        integrations:{
        },
        elements : [],
        styleControls: [],
    },
    vue: document.querySelector('.brx-body').__vue_app__,
    vueConfig: document.querySelector('.brx-body').__vue_app__.config,
    vueGlobalProp: document.querySelector('.brx-body').__vue_app__.config.globalProperties,
    cssVariables: [],
    nestableElements: [],
    helpers: {
        // CSS Variables
        isCSSVariablesTabActive: function(option){
            if (Object.values(ADMINBRXC.globalSettings.themeSettingsTabs).includes("css-variables") && Object.values(ADMINBRXC.globalSettings.generalCats.cssVariables).includes(option) ) return true;
            return false;
        },
        // Classes & Styles
        isClassesAndStylesTabActive: function(option){
            if (Object.values(ADMINBRXC.globalSettings.themeSettingsTabs).includes("classes-and-styles") && Object.values(ADMINBRXC.globalSettings.generalCats.classesAndStyles).includes(option) ) return true;
            return false;
        },
        // Builder Tweaks
        isBuilderTweaksTabActive: function(option){
            if (Object.values(ADMINBRXC.globalSettings.themeSettingsTabs).includes("builder-tweaks") && Object.values(ADMINBRXC.globalSettings.generalCats.builderTweaks).includes(option) ) return true;
            return false;
        },
        // AI
        isAIActive: function(){
            if (Object.values(ADMINBRXC.globalSettings.themeSettingsTabs).includes("ai") ) return true;
            return false;
        },
        // Extras
        isExtrasTabActive: function(option){
            if (Object.values(ADMINBRXC.globalSettings.themeSettingsTabs).includes("extras") && Object.values(ADMINBRXC.globalSettings.generalCats.extras).includes(option) ) return true;
            return false;
        },
        isCSSControlKey: function(key){
            if(ADMINBRXC.CSScontrolKeys.includes(JSON.parse(JSON.stringify(key.split(":")[0]))) && !ADMINBRXC.excludedControlKeyFromCSS.includes(JSON.parse(JSON.stringify(key.split(":")[0])))){
                return true;
            }
            return false;
        },
        isClassActive: function(){
            const activeClass = ADMINBRXC.vueGlobalProp.$_state.activeClass;
            if (typeof activeClass === "undefined" || !activeClass.hasOwnProperty('id')) return false;
            return true;
        }
    },
    populateCSSVariables: function(){
        const self = this;
        const temp = Array.from(document.styleSheets)
        .filter(
            sheet =>
            sheet.href === null || sheet.href.startsWith(window.location.origin)
        )
        .reduce(
            (acc, sheet) =>
            (acc = [
                ...acc,
                ...Array.from(sheet.cssRules).reduce(
                (def, rule) =>
                    (def =
                    rule.selectorText === ":root"
                        ? [
                            ...def,
                            ...Array.from(rule.style).filter(name =>
                            name.startsWith("--") && !name.startsWith("--builder")
                            )
                        ]
                        : def),
                []
                )
            ]),
            []
        )
        .sort(

        );
        temp.forEach(el => {
            self.cssVariables.push(`var(${el})`)
        })
    },
    globalClasses: () => {
        let globalClasses = [];
        if(typeof bricksData["loadData"] !== "undefined" && bricksData["loadData"].hasOwnProperty("globalClasses")){
            bricksData["loadData"]["globalClasses"].forEach(el =>{
                globalClasses.push(el['name']);
            })
        }
        return globalClasses;
    },
    loremSentences: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Integer nec odio. Praesent libero uctus non, massa.',
        'Sed cursus ante dapibus diam. Sed nisi.',
        'Nulla quis sem at nibh elementum imperdiet.',
        'Duis sagittis ipsum. Praesent mauris himenaeos.',
        'Fusce nec tellus sed augue semper porta.',
        'Vestibulum lacinia arcu eget nulla per conubia.',
        'Class aptent taciti sociosqu ad litora torquent.',
        'Curabitur sodales ligula in libero euismod in, nibh.',
        'Sed dignissim lacinia nunc nostra, per inceptos.',
        'Curabitur tortor pellentesque nibh aenean quam.',
        'In scelerisque sem at dolor maecenas mattis.',
        'Sed convallis tristique sem mauris massa.',
        'Proin ut ligula vel nunc egestas porttitor.',
        'Morbi lectus risus, iaculis vel, suscipit quis.',
        'Fusce ac turpis quis ligula lacinia aliquet.',
        'Mauris ipsum mam nec ante Nulla facilisi adipiscing diam.',
        'Nulla metus metus, ullamcorper vel, tincidunt sed.',
        'Quisque volutpat condimentum velit ante quis turpis.',
        'Class aptent taciti sociosqu ad litora torquent per conubia.',
        'Sed lacinia, urna non tincidunt mattis, tortor neque.',
        'Ut fringilla. Suspendisse potenti a cursus ipsum.',
        'Nunc feugiat mi a tellus consequat imperdiet.',
        'Vestibulum sapien. Proin quam. Etiam ultrices.',
        'Suspendisse in justo eu magna luctus suscipit.',
    ],
    webSentences: [
        'This is just placeholder text. We will change this out later. It’s just meant to fill space until your content is ready.',
        'Don’t be alarmed, this is just here to fill up space since your finalized copy isn’t ready yet.',
        'Once we have your content finalized, we’ll replace this placeholder text with your real content.',
        'Sometimes it’s nice to put in text just to get an idea of how text will fill in a space on your website.',
        'Traditionally our industry has used Lorem Ipsum, which is placeholder text written in Latin.',
        'Unfortunately, not everyone is familiar with Lorem Ipsum and that can lead to confusion.',
        'I can’t tell you how many times clients have asked me why their website is in another language.',
        'There are other placeholder text alternatives like Hipster Ipsum, Zombie Ipsum, Bacon Ipsum, and many more.',
        'While often hilarious, these placeholder passages can also lead to much of the same confusion.',
        'If you’re curious, this is Website Ipsum. It was specifically developed for the use on development websites.',
        'Other than being less confusing than other Ipsum’s, Website Ipsum is also formatted in patterns more similar to how real copy is formatted on the web today.',
    ],
    CSScontrolKeys: [],
    excludedControlKeyFromCSS: [
        '_cssGlobalClasses',
        '_conditions',
        '_interactions',
        '_cssClasses',
        '_cssId',
        '_attributes'
    ],
    fields: {
        CSSVariabe : {
            includedFields: [
                'div[data-control="number"]',
                {
                    selector: 'div[data-control="text"]',
                    hasChild: [
                        '#_cssTransition',
                        '#_transformOrigin',
                        '#_flexBasis',
                        '#_overflow',
                        '#_gridTemplateColumns',
                        '#_gridTemplateRows',
                        '#_gridAutoColumns',
                        '#_gridAutoRows',
                        '#_objectPosition',
                        '[id^="raw-"]'
                    ]
                }
            ],
            excludedFields: [
                // Query loop
                '.control-query',
                // Slider
                'div[data-controlkey="start"]',
                'div[data-controlkey="perPage"]',
                'div[data-controlkey="perMove"]',
                'div[data-controlkey="speed"]',
            ],
        },
        loremIpsum : {
            includedFields: [
                'div[data-control="textarea"]',
                {
                    selector:
                        '[data-controlkey="text"] div[data-control="text"][type="text"],[data-controlkey="title"] div[data-control="text"][type="text"], [data-controlkey="fields"] div[data-control="text"][type="text"], [data-controlkey="prefix"] div[data-control="text"][type="text"], [data-controlkey="suffix"] div[data-control="text"][type="text"], [data-controlkey="logoText"] div[data-control="text"][type="text"], [data-controlkey="actionText"] div[data-control="text"][type="text"], [data-controlkey="titleCustom"] div[data-control="text"][type="text"], [data-control-key="text"] div[data-control="text"][type="text"], [data-control-key="title"] div[data-control="text"][type="text"], [data-control-key="subtitle"] div[data-control="text"][type="text"], [data-control-key="name"] div[data-control="text"][type="text"], [data-control-key="buttonText"] div[data-control="text"][type="text"]',
                    hasChild: 'input.has-dynamic-picker',
                }
            ],
            excludedFields: [
                '.control-query',
                'div[data-control="conditions"]',
                'div[data-control="interactions"]',
                '#transition',
                'div[data-controlkey="speed"]',
                '[data-controlkey="shortcode"]',
                'div[data-control-key="format"]',
            ],
        },
        openAI : {
            includedFields: [
                'div[data-control="textarea"]',
                {
                    selector:
                        '[data-controlkey="text"] div[data-control="text"][type="text"], [data-controlkey="title"] div[data-control="text"][type="text"], [data-controlkey="fields"] div[data-control="text"][type="text"], [data-controlkey="prefix"] div[data-control="text"][type="text"], [data-controlkey="suffix"] div[data-control="text"][type="text"], [data-controlkey="logoText"] div[data-control="text"][type="text"], [data-controlkey="actionText"] div[data-control="text"][type="text"], [data-controlkey="titleCustom"] div[data-control="text"][type="text"], [data-control-key="text"] div[data-control="text"][type="text"], [data-control-key="title"] div[data-control="text"][type="text"], [data-control-key="subtitle"] div[data-control="text"][type="text"], [data-control-key="name"] div[data-control="text"][type="text"], [data-control-key="buttonText"] div[data-control="text"][type="text"]',
                    hasChild: 'input.has-dynamic-picker',
                }
            ],
            excludedFields: [
                '.control-query',
                'div[data-control="conditions"]',
                'div[data-control="interactions"]',
                '#transition',
                'div[data-controlkey="speed"]',
                '[data-controlkey="shortcode"]',
                'div[data-control-key="format"]',
            ],
        },
        colorsOnHover : {
            includedFields: [
                'ul.color-palette.grid > li.color',
            ],
            excludedFields: [
            ],
        },
        classesOnHover : {
            includedFields: [
                'div.bricks-control-popup > div.css-classes > ul:nth-of-type(2) > li > div.actions',
            ],
            excludedFields: [
            ],
        }
    },
    aihistory:[
    ],
    qry: (el) => {
        return document.querySelector(el);
    },
    qryAll: (els) => {
        return document.querySelectorAll(els);
    },
    initAcc: (elem, option) => {
        document.addEventListener('click', (e) => {
            if (!e.target.matches(elem + ' .brxc-accordion-btn')) return;
            else {
                if (!e.target.parentElement.classList.contains('active')) {
                    if (option == true) {
                        var elementList = document.querySelectorAll(elem + ' .brxc-accordion-container');
                        Array.prototype.forEach.call(elementList, (e) => {
                        e.classList.remove('active');
                        });
                    }
                    e.target.parentElement.classList.add('active');
                } else {
                    e.target.parentElement.classList.remove('active');
                }
            }
        });
    },
    minimizeModal: function(overlay){
        const inner = document.querySelector(`${overlay} .brxc-overlay__inner`);
        (inner.classList.contains('brxc-large')) ? inner.classList.remove('brxc-large') : '';
        inner.classList.add('brxc-medium');
    },
    maximizeModal: function(icon, overlay){
        const modal = document.querySelector(overlay);
        const inner = document.querySelector(`${overlay} .brxc-overlay__inner`);
        const icons = modal.querySelectorAll('.brxc-overlay__resize-icons i')
        const btn  = modal.querySelector('.brxc-overlay__close-btn')
        modal.classList.remove(...['sidebar', 'left', 'right']);
        inner.style.width = '';
        btn.style.left = '';
        btn.style.right = '';
        if(icon.classList.contains('active')) {
            icons.forEach(el => el.classList.remove('active'));
            inner.classList.remove('brxc-large');
            inner.classList.add('brxc-medium')
        } else {
            icons.forEach(el => el.classList.remove('active'));
            icon.classList.add('active');
            inner.classList.add('brxc-large');
            inner.classList.remove('brxc-medium')
        }
    },
    rightSidebarModal: function(icon, overlay){
        const self = this;
        const modal = document.querySelector(overlay);
        const inner = modal.querySelector(`.brxc-overlay__inner`);
        const btn  = modal.querySelector('.brxc-overlay__close-btn')
        const icons = modal.querySelectorAll('.brxc-overlay__resize-icons i')
        modal.classList.remove(...['sidebar', 'left', 'right']);
        inner.style.width = '';
        btn.style.left = '';
        btn.style.right = '';
        if(icon.classList.contains('active')) {
            icons.forEach(el => el.classList.remove('active'));
            const max = modal.querySelector('.brxc-overlay__resize-icons .fa-window-maximize');
            (inner.classList.contains('brxc-large')) ? max.classList.add('active') : '';
            return;
        };
        icons.forEach(el => el.classList.remove('active'));

        self.calculatePanelWidth('right', inner, btn);
        modal.classList.add(...['sidebar', 'right']);
        icon.classList.add('active');

    },
    calculatePanelWidth: function(position, inner, btn){
        if(position === 'left'){
            const panel = document.querySelector('#bricks-panel');
            const width = window.getComputedStyle( panel ,null).getPropertyValue('width');
            inner.style.width = width;
            btn.style.left = `calc(${width} + 8px)`;
        } else if(position === 'right') {
            const panel = document.querySelector('#bricks-structure');
            const width = window.getComputedStyle( panel ,null).getPropertyValue('width');
            inner.style.width = width;
            btn.style.right = `calc(${width} + 16px)`;
        }
    },
    leftSidebarModal: function(icon, overlay){
        const self = this;
        const modal = document.querySelector(overlay);
        const inner = modal.querySelector(`.brxc-overlay__inner`);
        const btn  = modal.querySelector('.brxc-overlay__close-btn')
        const icons = modal.querySelectorAll('.brxc-overlay__resize-icons i')
        modal.classList.remove(...['sidebar', 'left', 'right']);
        inner.style.width = '';
        btn.style.left = '';
        btn.style.right = '';
        if(icon.classList.contains('active')) {
            icons.forEach(el => el.classList.remove('active'));
            const max = modal.querySelector('.brxc-overlay__resize-icons .fa-window-maximize');
            (inner.classList.contains('brxc-large')) ? max.classList.add('active') : '';
            return;
        }
        icons.forEach(el => el.classList.remove('active'));
        self.calculatePanelWidth('left', inner, btn);
        modal.classList.add(...['sidebar', 'left']);
        icon.classList.add('active');

    },
    autocomplete: function(inp, arr, type) {
        const self = this;
        var currentFocus = 0;
        if (inp.dataset.autocomplete === "true") return;
        inp.setAttribute("data-autocomplete", "true");
        inp.addEventListener("keyup", function(e) {
            if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13) return;
            var a, b, i, j, ul, val = this.value;
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items bricks-control-popup bottom");
            this.parentNode.appendChild(a);
            ul = document.createElement("ul");
            a.appendChild(ul);
            for (i = 0, j = 0; i < arr.length; i++) {
              if (arr[i].toUpperCase().includes(val.toUpperCase())) {
                j++
                b = document.createElement("li");
                b.innerHTML += arr[i];
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    const event = new Event('input', {
                        bubbles: true,
                        cancelable: true,
                    });
                    
                    inp.dispatchEvent(event);
                    closeAllLists();
                });
                b.addEventListener("mouseenter", function(e) {
                    inp.setAttribute('data-autocomplete-initial', inp.value);
                    inp.value = this.getElementsByTagName("input")[0].value;
                    const event = new Event('input', {
                        bubbles: false,
                        cancelable: true,
                    });
                    
                    inp.dispatchEvent(event);
                });
                b.addEventListener("mouseleave", function(e) {
                    inp.value = inp.dataset.autocompleteInitial;
                    const event = new Event('input', {
                        bubbles: false,
                        cancelable: true,
                    });
                    
                    inp.dispatchEvent(event);
                    inp.removeAttribute('data-autocomplete-initial');
                });
                ul.appendChild(b);
              }
            }
            if(j === 0){
                closeAllLists();
            }
        });

        inp.addEventListener("keydown", function(e){
            var x = document.getElementById(inp.id + "autocomplete-list");
            if (!x) return;
            x = x.getElementsByTagName("li");
            if (e.keyCode == 40) {
              currentFocus++;
              addActive(x);
              const active = Array.from(x).find(el => el.classList.contains('selected'));
              const value = active.querySelector('input[type="hidden"]').value;
              inp.value = value;
              const event = new Event('input', {
                bubbles: false,
                cancelable: true,
              });
            
              inp.dispatchEvent(event);

            } else if (e.keyCode == 38) { 
              currentFocus--;
              addActive(x);
              const active = Array.from(x).find(el => el.classList.contains('selected'));
              const value = active.querySelector('input[type="hidden"]').value;
              inp.value = value;
              const event = new Event('input', {
                bubbles: false,
                cancelable: true,
              });
            
              inp.dispatchEvent(event);

            } else if (e.keyCode == 13) {
              e.preventDefault();
              if (currentFocus > -1) {
                if (x) x[currentFocus].click();
              }
            } else if (e.keyCode == 9) {
                closeAllLists();
            }
        })

        function addActive(x) {
          if (!x) return false;
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          x[currentFocus].classList.add("selected");
        }
        function removeActive(x) {
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("selected");
          }
        }
        function closeAllLists(elmnt,tab) {
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (tab || (elmnt != x[i] && elmnt != inp)) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }

      document.addEventListener("click", function (e) {
          closeAllLists(e.target, false);
      });
    },
    debounce: (fn, threshold) => {
        var timeout;
        threshold = threshold || 200;
        return function debounced() {
        clearTimeout(timeout);
        var args = arguments;
        var _this = this;
    
        function delayed() {
            fn.apply(_this, args);
        }
        timeout = setTimeout(delayed, threshold);
        };
    },
    randomize: (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    },
    openModal: function(target, id, focus = false){
        const self = this;
        const wrapper = document.querySelector(id);
        wrapper.classList.add('active');

        document.addEventListener('keydown', function(e) {
            (e.key === "Escape") ? self.closeModal(target, target.target, id) : '';
        });
        if(focus) focus.focus()

        // Resize
        const inner = wrapper.querySelector(`.brxc-overlay__inner`);
        const btn = wrapper.querySelector('.brxc-overlay__close-btn')
        inner.style.width = '';
        btn.style.left = '';
        btn.style.right = '';
        if (wrapper.classList.contains('left')) {
            self.calculatePanelWidth('left', inner, btn)
        } else if(wrapper.classList.contains('right')) {
            self.calculatePanelWidth('right', inner, btn)
        } 
        //

        const btns = wrapper.querySelectorAll('#brxcVariableOverlay .brxc-overlay__action-btn');
        if(btns.length < 1) return;

        const initialValue = target.value;
        btns.forEach(btn => {
            let wasClicked = false;
            if (target.value === btn.dataset.variable){
                btn.classList.add('active');
            }
            btn.onmouseleave = () => {
                // Only perform these actions if the button was not clicked.
                if (!wasClicked) {
                    target.value = initialValue;
                    const event = new Event('input', {
                        bubbles: true,
                        cancelable: true,
                    });
                    target.dispatchEvent(event);
                }
                // Reset the wasClicked flag
                wasClicked = false;
            };
        
            btn.onmouseenter = () => {
                const dataset = btn.dataset.variable;
                target.value = dataset;
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
        
                target.dispatchEvent(event);
            };
        
            btn.onclick = () => {
                // Set the wasClicked flag to true
                wasClicked = true;
                
                const dataset = btn.dataset.variable;
                target.value = dataset;
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                
                target.dispatchEvent(event);
                self.closeModal(target, target.target, id);
            }
        });
    },
    openPlainClassesModal: function(target, classes, id, focus = false){
        const self = this;
        const wrapper = document.querySelector(id);
        const finalClasses = []
        classes.forEach(el => {
            finalClasses.push(el.textContent.replace('.',''));
        });
        document.querySelector('#brxcPlainClassesOverlay .CodeMirror').CodeMirror.setValue(finalClasses.join(' '));
        wrapper.classList.add('active');

        document.addEventListener('keydown', function(e) {
            (e.key === "Escape") ? self.closeModal(target, target.target, id) : '';
        });
        setTimeout(() => {
            focus.focus();
            focus.setCursor(focus.lineCount(), 0);
        }, 50)
    


    },
    openAIModal: function(prefix, global = false, target, id){
        const self = this;

        if (global === false){
            // Completion
            const chatMore = document.querySelector('#brxcopenAIOverlay #' + prefix + 'ChatMore');
            const existingInsertBtn = document.querySelector('#brxcopenAIOverlay #' + prefix + 'InsertContent');
            const existingReplaceBtn = document.querySelector('#brxcopenAIOverlay #' + prefix + 'ReplaceContent');
            if(existingInsertBtn) existingInsertBtn.remove();
            if(existingReplaceBtn) existingReplaceBtn.remove();
            chatMore.insertAdjacentHTML(
                'afterend',
                '<div id="' + prefix + 'InsertContent" class="brxc-overlay__action-btn"><span>Insert Content</span></div><div id="' + prefix + 'ReplaceContent" class="brxc-overlay__action-btn primary"><span>Replace Content</span></div>'
            );

            const insertBtn = document.querySelector('#brxcopenAIOverlay #' + prefix + 'InsertContent');
            insertBtn.addEventListener('click', () =>{
                const value = document.querySelector('#brxcopenAIOverlay input[name="openai-results"]:checked + label .message.assistant').textContent;
                target.value += value.replace(/\n/g,'<br>');
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                target.dispatchEvent(event);
                self.closeModal(target, target.target, id);
                self.vueGlobalProp.$_showMessage('AI Content Inserted');
            })
            const replaceBtn = document.querySelector('#brxcopenAIOverlay #' + prefix + 'ReplaceContent');
            replaceBtn.addEventListener('click', () =>{
                const value = document.querySelector('#brxcopenAIOverlay input[name="openai-results"]:checked + label .message.assistant').textContent;
                target.value = value.replace(/\n/g,'<br>');
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                target.dispatchEvent(event);
                self.closeModal(target, target.target, id);
                self.vueGlobalProp.$_showMessage('AI Content Inserted');
            })

            // Edit
            const editTextArea = document.querySelector('#brxcopenAIOverlay #' + prefix + 'EditText');
            const editbtnwrapper = document.querySelector('#brxcopenAIOverlay #' + prefix + 'InsertEditContentWrapper')
            const existingInsertEditBtn = document.querySelector('#brxcopenAIOverlay #' + prefix + 'InsertEditContent');
            const existingReplaceEditBtn = document.querySelector('#brxcopenAIOverlay #' + prefix + 'ReplaceEditContent');
            if(existingInsertEditBtn) existingInsertEditBtn.remove();
            if(existingReplaceEditBtn) existingReplaceEditBtn.remove();
            editTextArea.value = target.value.replaceAll('<br>', '\n');
            editbtnwrapper.innerHTML += '<div id="' + prefix + 'InsertEditContent" class="brxc-overlay__action-btn"><span>Insert Content</span></div>';
            editbtnwrapper.innerHTML += '<div id="' + prefix + 'ReplaceEditContent" class="brxc-overlay__action-btn primary"><span>Replace Content</span></div>';
            const insertEditBtn = document.querySelector('#brxcopenAIOverlay #' + prefix + 'InsertEditContent');
            insertEditBtn.addEventListener('click', () =>{
                const value = document.querySelector('#brxcopenAIOverlay input[name="openai-edit-results"]:checked + label .message.assistant').textContent;
                target.value += value.replace(/\n/g,'<br>');
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                target.dispatchEvent(event);
                self.closeModal(target, target.target, id);
                //self.showMessage('AI Content Inserted')
                self.vueGlobalProp.$_showMessage('AI Content Inserted');
            })
            const replaceEditBtn = document.querySelector('#brxcopenAIOverlay #' + prefix + 'ReplaceEditContent');
            replaceEditBtn.addEventListener('click', () =>{
                const value = document.querySelector('#brxcopenAIOverlay input[name="openai-edit-results"]:checked + label .message.assistant').textContent;
                target.value = value.replace(/\n/g,'<br>');
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                target.dispatchEvent(event);
                self.closeModal(target, target.target, id);
                //self.showMessage('AI Content Inserted')
                self.vueGlobalProp.$_showMessage('AI Content Inserted');
            })
        }

        // Open modal
        const wrapper = document.querySelector(id);
        wrapper.classList.add('active');
        document.addEventListener('keydown', function(e) {
            (e.key === "Escape") ? self.closeModal(target, target.target, id) : '';
        });
    },
    openExtendClassModal: function(target,id){
        const self = this;
        const select = document.querySelector('#brxcExtendModal #brxc-extendcategoryOptions');
        select.value = self.vueGlobalProp.$_state.activeElement.name;
        const wrapper = document.querySelector(id);
        wrapper.classList.add('active');
        document.addEventListener('keydown', function(e) {
            (e.key === "Escape") ? self.closeModal(target, target.target, id) : '';
        });
    },
    openFindReplaceModal: function(target,global, id){
        const self = this;
        const wrapper = document.querySelector(id);
        const posRadios = document.querySelectorAll('#brxcFindReplaceModal [name=brxc-findreplacePosition]');
        const select = document.querySelector('#brxcFindReplaceModal #brxc-findreplacecategoryOptions');
        const alert = document.querySelector('#brxcFindReplaceModal .alert');

        if (global){
            select.value = 'all';
            const pageRadio = document.querySelector('#brxcFindReplaceModal #brxc-findreplace-page');
            pageRadio.dispatchEvent(new MouseEvent('click'));
            posRadios.forEach(radio => {
                radio.setAttribute('disabled', true);
            })
            alert.classList.add('active');

        } else {
            select.value = self.vueGlobalProp.$_state.activeElement.name;
            const SiblingRadio = document.querySelector('#brxcFindReplaceModal #brxc-findreplace-siblings');
            SiblingRadio.dispatchEvent(new MouseEvent('click'));
            posRadios.forEach(radio => {
                radio.removeAttribute('disabled');
            })
            alert.classList.remove('active');
        }
        wrapper.classList.add('active');
        document.addEventListener('keydown', function(e) {
            (e.key === "Escape") ? self.closeModal(target, target.target, id) : '';
        });
    },
    generateGlobalClass: function(prefix,name){
        const self = this;
        const id = self.vueGlobalProp.$_generateId()
        self.vueGlobalProp.$_state.globalClasses.push({
            id: prefix + id,
            name: name
        })

        return id;
    },
    importedClasses: function(){
        const self = this;
        let settingsHaveChanged = false;
        let existingClassesId = [];
        const globalClasses = self.vueGlobalProp.$_state.globalClasses;
        const importedClasses = self.globalSettings.importedClasses;
        if (importedClasses.length > 0){
            importedClasses.forEach(e => {
                globalClasses.forEach((item) => { 
                    if (item.name === e) { 
                        existingClassesId.push({id: item.id,name: item.name});
                    }
                }); 
            })

            const importedClassesToCreate = importedClasses.filter(str => !existingClassesId.some(obj => obj.name === str));
            if (importedClassesToCreate.length > 0){
                importedClassesToCreate.forEach( e => {
                    self.generateGlobalClass('brxc_imported_',e);
                    settingsHaveChanged = true;

                })
            }
        }

        //Remove classes

        for (let i = 0; i < globalClasses.length; i++) { 
            const obj = globalClasses[i]; 
            const isImported = obj.id.includes('brxc_imported');  
            const isIncluded = importedClasses.includes(obj.name);
            if (isImported && isIncluded) {
                continue;
            } 
            if (isImported && !isIncluded) { 
                self.vueGlobalProp.$_state.globalClasses.splice(i, 1);
                settingsHaveChanged = true;
                i--; 
            }
        }

        // Update DB
        if (settingsHaveChanged === true) {
            self.vueGlobalProp.$_state.unsavedChanges.push('globalClasses');
            self.vueGlobalProp.$_state.unsavedChanges.push('globalClassesLocked')
        }
    },
    importedGrids: function(){
        const self = this;
        let settingsHaveChanged = false;
        let existingClassesId = [];
        const globalClasses = self.vueGlobalProp.$_state.globalClasses;
        const grids = self.globalSettings.gridClasses;
        if (grids.length > 0){
            grids.forEach(e => {
                globalClasses.forEach((item) => { 
                    if (item.name === e) { 
                        existingClassesId.push({id: item.id,name: item.name});
                    }
                }); 
            })

            const gridsToCreate = grids.filter(str => !existingClassesId.some(obj => obj.name === str));
            if (gridsToCreate.length > 0){
                gridsToCreate.forEach( e => {
                    self.generateGlobalClass('brxc_grid_', e);
                    settingsHaveChanged = true;
                })
            }
        }
        
        //Remove classes

        for (let i = 0; i < globalClasses.length; i++) { 
            const obj = globalClasses[i]; 
            const isGrid = obj.id.includes('brxc_grid_');  
            const isIncluded = grids.includes(obj.name); 
            if (isGrid && isIncluded) {
                continue;
            } 
            if (isGrid && !isIncluded) { 
                self.vueGlobalProp.$_state.globalClasses.splice(i, 1);
                settingsHaveChanged = true;
                i--; 
            }
        }

        // Update DB
        if (settingsHaveChanged === true) {
            self.vueGlobalProp.$_state.unsavedChanges.push('globalClasses');
            self.vueGlobalProp.$_state.unsavedChanges.push('globalClassesLocked')
        }

        
    },
    savePlainClasses: function(target,classes) {
        const self = this;
        let finalClasses = []
        let newClasses = [];
        let existingClassesId = [];
        const globalClasses = self.vueGlobalProp.$_state.globalClasses;
        if (classes) {
            newClasses = classes.replace(/\s\s+/g, ' ').split(" ").filter((value, index, array) => array.indexOf(value) === index);
        }
  
        if (newClasses.length > 0){
            newClasses.forEach(e => {
                globalClasses.forEach((item) => { 
                    if (item.name === e) { 
                        existingClassesId.push({id: item.id,name: item.name});
                        finalClasses.push(item.id)
                    }
                }); 
            })

            const newClassesToCreate = newClasses.filter(str => !existingClassesId.some(obj => obj.name === str));
            if (newClassesToCreate.length > 0){
                newClassesToCreate.forEach( e => {
                    const id = self.generateGlobalClass('', e);
                    finalClasses.push(id)
                })
            }
        }
        self.vueGlobalProp.$_state.activeElement.settings._cssGlobalClasses = finalClasses;

        setTimeout(self.closeModal(target, target.target, '#brxcPlainClassesOverlay'), 300);
        self.vueGlobalProp.$_showMessage('Classes updated!');
    },
    resetClasses: function(target){
        const self = this;
        self.savePlainClasses(target, '');
        if (typeof self.vueGlobalProp.$_state.activeElement.settings !== "undefined" && self.vueGlobalProp.$_state.activeElement.settings.hasOwnProperty('_cssGlobalClasses')) delete self.vueGlobalProp.$_state.activeElement.settings._cssGlobalClasses;
        self.closeModal(target, target.target, '#brxcPlainClassesOverlay');
        self.vueGlobalProp.$_showMessage('Classes reset successfully!');
    },
    closeModal: (event, target, id) => {
        if( event.target !== target ) {
            return;
        }
        const wrapper = document.querySelector(id);
        wrapper.classList.remove('active');
        const btns = wrapper.querySelectorAll('.brxc-overlay__action-btn.active');
        if( id === "#brxcVariableOverlay"){
            const btns = wrapper.querySelectorAll('.brxc-overlay__action-btn.active');
            btns.forEach(btn => { btn.classList.remove('active');})
        }
        

    },
    addLorem: function(target, btn) {
        const self = this;
        let used = parseInt(btn.dataset.used);
        let tempArr;
        let arr;
        (self.globalSettings['loremIpsumtype'] === 'human') ? tempArr = ADMINBRXC.webSentences : tempArr = ADMINBRXC.loremSentences;
        (used === tempArr.length) ? arr = tempArr : arr = tempArr.slice(used);
        
        if(target.value.slice(-1)[0] === "."){
            target.value = target.value + ' ' + arr[0];
        } else {
            target.value = target.value + arr[0];
        }
        (used === tempArr.length) ? btn.setAttribute('data-used', 1) : btn.setAttribute('data-used', used + 1);
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
          
        target.dispatchEvent(event);
    },
    completionAPIRequest: function(prefix, global, overlay, target, history, n, json, type){
        const self = this;
        jQuery.ajax({
            type: 'POST',
            url: openai_ajax_req.ajax_url,
            data: {
                action: 'openai_ajax_function',
                nonce: openai_ajax_req.nonce
            },
            success: function(response) {
                const post = async () => {
                    const rawResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization' : 'Bearer '+ response,
                        },
                      body: JSON.stringify(json)
                    });
                    const content = await rawResponse.json();
                    console.log(content);
                    if(content.error){
                        self.insertErrorMessage(prefix, global, overlay, content.error.message);
                        target.classList.remove('disable');
                    } else {
                        for(i=0; i<n;i++){
                            if(type === "chat"){
                                self.insertAIResponse(prefix, global, overlay, content.choices[i].message.content.trim(), i);
                            } else if(type === "edit"){
                                self.insertAIEditResponse(prefix, global, overlay, content.choices[i].message.content.trim(), i);
                            } else if(type === "code"){
                                self.insertAICodeResponse(prefix, global, overlay, content.choices[i].message.content.trim(), i);
                            }
                        }
                        target.classList.remove('disable');
                        history['assistant'] = content;
                        self.aihistory.push(history);
                    }
                };
                post();
            },
            error: function(response){
                console.log('Something went wrong with the OpenAI AJAX request: ' + response);
                target.classList.remove('disable');
            }
        });
    },
    getAIResponse: function(prefix, target, global = false, overlay, voiceTones, customToneVal, temp = 0, maxTokens = 15, n = 1, topP = 1, pres = 0, freq = 0, model){
        const self = this;
        target.classList.add('disable');
        let message = [];
        let history = [];
        let tones = [];
        let tone = '';
        if (voiceTones.length > 0){
            if(customToneVal && Array.from(voiceTones).filter(el => el.dataset.tone == 'custom').length > 0 && voiceTones.length === 1){
                tone = customToneVal;
            } else {
                let customTone = '';
                if(customToneVal && Array.from(voiceTones).filter(el => el.dataset.tone == 'custom').length > 0){
                    customTone = ' ' + customToneVal;
                };
                Array.from(voiceTones).filter(el => {
                    if (el.dataset.tone != 'custom'){
                        tones.push(el.dataset.tone);
                    }
                });
                tone = 'Adjust the tone of the text to be ' + tones.join(" and ") + '.' + customTone;
            }
            message.push({"role": "system", "content": tone});
        }
        const fmessages = document.querySelectorAll(overlay + ' .brxc-overlay__pannel.completion .message');
        fmessages.forEach(fmessage => {
            if(fmessage.classList.contains('user')){
                message.push({"role": "user", "content": fmessage.value});
            } else {
                message.push({"role": "assistant", "content": fmessage.textContent});
            }
        })
        history['user'] = {
                date: Date.now(),
                type: 'completion',
                system: tone,
                message: message[message.length - 1].content,
                maxTokens: maxTokens,
                choices: n,
                temperature: temp,
                top_p: topP,
                presence_penalty: pres,
                frequency_penalty: freq,
        }

        let json = {
            "model": model, 
            "messages": message,
            "max_tokens": maxTokens,
        };

        if (n != 1) json.n = n;
        if (temp != 1) json.temperature = Number.parseFloat(temp);
        if (topP != 1) json.top_p = Number.parseFloat(topP);
        if (pres != 0) json.presence_penalty = Number.parseFloat(pres);
        if (freq != 0) json.frequency_penalty = Number.parseFloat(freq);

        self.completionAPIRequest(prefix, global, overlay, target, history, n, json, 'chat');
    },
    getEditAIResponse: function(prefix, target, global = false, overlay, voiceTones, customToneVal, temp = 0, maxTokens, n = 1, topP = 1, pres = 0, freq = 0, model){
        const self = this;
        target.classList.add('disable');
        const instruction = document.querySelector(overlay + ' .brxc-overlay__pannel.edit .instruction').value;
        let message = [];
        let history = [];
        let tones = [];
        let tone = 'You are an helpful assistant.';
        if (voiceTones.length > 0){
            Array.from(voiceTones).filter(el => {
                if (el.dataset.tone != 'custom'){
                    tones.push(el.dataset.tone);
                }
            });
            tone += 'Adjust the tone of the text to be ' + tones.join(" and ") + '.';
        }
        message.push({"role": "system", "content": tone});

        const fmessages = document.querySelectorAll(overlay + ' .brxc-overlay__pannel.edit .message');
        fmessages.forEach(fmessage => {
            if(fmessage.classList.contains('user')){
                message.push({"role": "user", "content": `Here is the content: "${fmessage.value}". Here are the instructions: "${instruction}."`});
            } else if (fmessage.classList.contains('assistant')){
                message.push({"role": "assistant", "content": fmessage.textContent});
            }
        })
        history['user'] = {
                date: Date.now(),
                type: 'completion',
                system: tone,
                message: message[message.length - 1].content,
                maxTokens: maxTokens,
                choices: n,
                temperature: temp,
                top_p: topP,
                presence_penalty: pres,
                frequency_penalty: freq,
        }

        let json = {
            "model": model, 
            "messages": message,
            "max_tokens": maxTokens,
        };

        if (n != 1) json.n = n;
        if (temp != 1) json.temperature = Number.parseFloat(temp);
        if (topP != 1) json.top_p = Number.parseFloat(topP);
        if (pres != 0) json.presence_penalty = Number.parseFloat(pres);
        if (freq != 0) json.frequency_penalty = Number.parseFloat(freq);

        self.completionAPIRequest(prefix, global, overlay, target, history, n, json, 'edit');
    },
    getImageAIResponse: function(prefix, target,global = false, overlay, n = 1, size = "256x256"){
        const self = this;
        target.classList.add('disable');
        const prompt = document.querySelector(overlay + ' .brxc-overlay__pannel.image .message.input').value;
        let history = [];
        history['user'] = {
            date: Date.now(),
            type: 'images',
            message: prompt,
            choices: parseInt(n),
            sizes: size,
        }
        const api = () => {
            jQuery.ajax({
                type: 'POST',
                url: openai_ajax_req.ajax_url,
                data: {
                    action: 'openai_ajax_function',
                    nonce: openai_ajax_req.nonce
                },
                success: function(response) {
                    const post = async () => {
                        const rawResponse = await fetch('https://api.openai.com/v1/images/generations', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                              'Authorization' : 'Bearer '+ response,
                            },
                          body: JSON.stringify({
                            "prompt": prompt,
                            "n": n,
                            "size": size,
                            "response_format": "b64_json"
                            })
                        });
                        const content = await rawResponse.json();
                        console.log(content);
                        if(content.error){
                            self.insertErrorMessage(prefix, global, overlay, content.error.message);
                            target.classList.remove('disable');
                        } else {
                            self.insertAIImagesResponse(prefix, global, overlay, content.data, n);
                            target.classList.remove('disable');
                            history['assistant'] = content;
                            self.aihistory.push(history);
                        }
                    };
                    post();
                },
                error: function(response){
                    console.log('Something went wrong with the OpenAI ImageAJAX request: ' + response);
                    target.classList.remove('disable');
                }
            });
        }
        api();
    },
    //getCodeAIResponse: function(prefix, target,global = false, overlay, temp = 0, maxTokens = 2000, n = 1, topP = 1, pres = 0, freq = 0, model){
    getCodeAIResponse: function(prefix, target, global = false, overlay, temp = 0, maxTokens, n = 1, topP = 1, pres = 0, freq = 0, model){
        const self = this;
        target.classList.add('disable');
        //const input = "/* Write The following request using CSS only (No HTML, Javavascript, SCSS or SASS). The request: " + document.querySelector(overlay + ' .brxc-overlay__pannel.code .input').value + " */";
        let history = [];
        let message = [{"role": "system", "content": "You are an helpful assistant and a CSS Expert. You just write vanilla CSS codes only (No HTML, Javavascript, SCSS or SASS)."}];
        const fmessages = document.querySelectorAll(overlay + ' .brxc-overlay__pannel.code .message');
        fmessages.forEach(fmessage => {
            if(fmessage.classList.contains('user')){
                message.push({"role": "user", "content": `/* The following request is meant to be pasted in a CSS file, so comment any text accordingly. Here is the request: ${fmessage.value} */`});
            }
        })
        history['user'] = {
            date: Date.now(),
            type: 'code',
            message: message[message.length - 1].content,
            maxTokens: 4000,
            choices: n,
            temperature: temp,
            top_p: topP,
            presence_penalty: pres,
            frequency_penalty: freq,
        }

        let json = {
            "model": model, 
            "messages": message,
            "max_tokens": maxTokens,
        };

        if (n != 1) json.n = n;
        if (temp != 1) json.temperature = Number.parseFloat(temp);
        if (topP != 1) json.top_p = Number.parseFloat(topP);
        if (pres != 0) json.presence_penalty = Number.parseFloat(pres);
        if (freq != 0) json.frequency_penalty = Number.parseFloat(freq);

        self.completionAPIRequest(prefix, global, overlay, target, history, n, json, 'code');
    },
    insertErrorMessage: function(prefix, global, overlay, response){
        const self = this;
  
        const wrapper = document.querySelector(overlay + ' .brxc-overlay__error-message-wrapper');
        let inner = `<div class="brxc-ai-response-wrapper remove-on-reset">`;
        inner += `<div name="${prefix}-prompt-response" class="error-message" id="${prefix}ErrorMsg"><i class="bricks-svg ti-close" onClick="this.parentElement.parentElement.remove()"></i>OpenAI API returned an error with the following message: "${response}"</div></div>`;

        wrapper.innerHTML = inner;
        
    },
    saveAIImagetoMediaLibrary: function(target,imageUrl) {
        target.classList.add('disable');
        const api = () => {
            jQuery.ajax({
                type: 'POST',
                url: openai_ajax_req.ajax_url,
                data: {
                    action: 'openai_save_image_to_media_library',
                    image_url: imageUrl,
                    nonce: openai_ajax_req.nonce
                },
                success: function(response) {
                    target.classList.remove('disable');
                    target.textContent = 'Image saved successfully!';
                    setTimeout(() => {
                            target.textContent = 'Save to Media Library';
                    }, 1000)
                },
                error: function(response) {
                    target.classList.remove('disable');
                    target.textContent = 'Error - Something went wrong!';
                    setTimeout(() => {
                            target.textContent = 'Save to Media Library';
                    }, 1000)
                },
            });
        }
        api();
    },
    downloadAIImage: function (src){
        const a = document.createElement("a");
        a.href = src;
        a.download = "AI-Image.png";
        a.click();
        a.remove();
    },
    movePanel: (wrapper, value) => {
        wrapper.style.transform = 'translateX(' + value + ')';
    },
    insertAIResponse: function (prefix, global, overlay, response, n){
        const self = this;
        const randClass = self.randomize(6);
        const wrapper = document.querySelector(overlay + ' .brxc-overlay__pannel.completion #' + prefix + 'InsertContentWrapper')
        const generateWrapper = document.querySelector(overlay + ' .brxc-overlay__pannel.completion #' + prefix + 'GenerateContentWrapper');
        generateWrapper.classList.toggle('active');
        let inner = `<div class="brxc-ai-response-wrapper remove-on-reset"><input type="radio" id="brxc${randClass}" name="openai-results"><label for="brxc${randClass}" class="brxc-input__label">`;
        if (n === 0 ) {
            inner += "<p>OpenAI Assistant</p>";
        }
        inner += `<div name="${prefix}-prompt-response" class="message assistant" id="${prefix}PromptResponse">${response}</div></label></div>`;

        wrapper.insertAdjacentHTML(
            'beforebegin',
            inner
        );
        const radios = document.querySelectorAll('input[name="openai-results"]')
        radios[radios.length - 1].checked = true;
    },
    insertAIEditResponse: function (prefix, global, overlay, response, n){
        const self = this;
        const randClass = self.randomize(6);
        const wrapper = document.querySelector(overlay + ' .brxc-overlay__pannel.edit #' + prefix + 'InsertEditContentWrapper');
        const generateWrapper = document.querySelector(overlay + ' .brxc-overlay__pannel.edit #' + prefix + 'GenerateEditContentWrapper');
        generateWrapper.classList.toggle('active');
        let inner = `<div class="brxc-ai-response-wrapper remove-on-reset"><input type="radio" id="brxc${randClass}" name="${prefix}-edit-results"><label for="brxc${randClass}" class="brxc-input__label">`;
        if (n === 0 ) {
            inner += "<p>OpenAI Assistant</p>";
        }
        inner += `<div name="${prefix}-prompt-response" class="message assistant" id="${prefix}PromptResponse">${response}</div></label></div>`;
        wrapper.insertAdjacentHTML(
            'beforebegin',
            inner
        );
        const radios = document.querySelectorAll('input[name="' + prefix + '-edit-results"]')
        radios[radios.length - 1].checked = true;
    },
    insertAIImagesResponse: function (prefix, global, overlay, response, n){
        const self = this;
        const wrapper = document.querySelector(overlay + ' .brxc-overlay__pannel.image #' + prefix + 'InsertImagesContentWrapper')
        const generateWrapper = document.querySelector(overlay + ' .brxc-overlay__pannel.image #' + prefix + 'GenerateImagesContentWrapper');
        generateWrapper.classList.toggle('active');
        inner = `<div class="brxc-ai-response-wrapper remove-on-reset">
                 <label class="brxc-input__label">OpenAI Assistant</label>
                 <div class='brxc__img-wrapper'>`;
        for(i = 0; i<n; i++){
            const randClass = self.randomize(6);
            inner += `<input type="radio" id="brxc${randClass}" name="${prefix}-images-results">
                  <label for="brxc${randClass}" class="brxc-input__label">
                    <img src="data:image/png;base64,${response[i].b64_json}" alt="" class="brxc__image" />
                  </label>`;         
        }
        inner += "</div></div>";
        wrapper.insertAdjacentHTML(
            'beforebegin',
            inner
        );
        const radios = document.querySelectorAll('input[name="' + prefix + '-images-results"]')
        radios[radios.length - 1].checked = true;
    },
    insertAICodeResponse: function (prefix, global, overlay, response, n){
        const self = this;
        const randClass = self.randomize(6);
        const generateWrapper = document.querySelector(overlay + ' .brxc-overlay__pannel.code #' + prefix + 'GenerateCodeContentWrapper');
        generateWrapper.classList.toggle('active');
        let inner = `<div class="brxc-ai-response-wrapper remove-on-reset"><input type="radio" id="brxc${randClass}" name="${prefix}-code-results"><label for="brxc${randClass}" class="brxc-input__label">`;
        if (n === 0 ) {
            inner += "<p>OpenAI Assistant</p>";
        }
        inner += `<div name="${prefix}-prompt-response" class="message assistant" id="${prefix}PromptResponse"><textarea>${response}</textarea></div></label></div>`;
        const wrapper = document.querySelector(overlay + ' .brxc-overlay__pannel.code #' + prefix + 'InsertCodeContentWrapper');
        wrapper.insertAdjacentHTML(
            'beforebegin',
            inner
        );
        const textarea = document.querySelector(`label[for="brxc${randClass}"] textarea`);
        self.setNewCodeMirror(textarea);
        const radios = document.querySelectorAll('input[name="' + prefix + '-code-results"]')
        radios[radios.length - 1].checked = true;
    },
    pasteAICode: function(generatedCode){
        const pageCSSLabel = document.querySelector('#brxcCSSOverlay #global-code-openai-page')
        const pageCSS = document.querySelector('#brxcCSSOverlay #brxcPageCSSWrapper .CodeMirror');
        const pageCSSValue = pageCSS.CodeMirror.getValue();
        const finalCode = pageCSSValue + "\n" + generatedCode;
        pageCSS.CodeMirror.setValue(finalCode);
        pageCSSLabel.dispatchEvent(new Event('click'));
        pageCSSLabel.checked = true;
    },
    chatMoreAIResponse: function (prefix, global = false, overlay){
        const wrapper = document.querySelector(overlay + ' #' + prefix + 'InsertContentWrapper')
        wrapper.insertAdjacentHTML(
            'beforebegin',
            `<label for="${prefix}PromptText" class="brxc-input__label remove-on-reset">User Prompt (Required)</label><textarea name="${prefix}-prompt-text" id="${prefix}PromptText" class="${prefix}-prompt-text message user remove-on-reset" placeholder="Type your prompt text here..." cols="30" rows="3" spellcheck="false"></textarea>`
        );
        const container = document.querySelector(overlay + ' .brxc-overlay__pannel.completion')
        const btns = document.querySelector(overlay + ' .brxc-overlay__pannel.completion #' + prefix + 'GenerateContentWrapper')
        btns.classList.toggle('active');
        container.insertBefore(btns, wrapper);

    },
    resetAIresponses: (resets, removes, generate) => {
        resets.forEach(reset => {reset.value = ''});
        removes.forEach(el => {el.remove()});
        const generateWrapper = generate;
        generateWrapper.classList.add('active');
    },
    toggleCustomToneVoice: (prefix, custom) => {
        let input = document.querySelector('#' + prefix + 'System');
        if ( custom.checked==true ) {
            input.style.display = 'block';
        } else {
            input.style.display = 'none';
        }

    },
    toggleRadioVisibility: function(){
        const radios = document.querySelectorAll('[name="brxc-extend-styles"]');
        const target = document.querySelector('#brxc-extend-css-property');
        const eraseClass = document.querySelector('#brxc-extend-erase-classes');
        radios.forEach(radio => {
            radio.addEventListener('change', () =>{
                const radio = document.querySelector('#brxc-extend-style');
                (radio.checked == true) ? target.style.display = 'block' : target.style.display = 'none';
                (radio.checked == true) ? eraseClass.style.display = 'none' : eraseClass.style.display = 'block';
            })
        })

    },
    mounAIHistory: function(prefix, overlay){
        const self = this;

        const canvas = document.querySelector(overlay + ' .brxc-overlay__pannel.history .brxc-canvas');

        if (self.aihistory.length === 0) return canvas.innerHTML = "<p class='brxc__no-record'>No records yet. Please come back here after you generated some AI content.</p>"
        // wrapper
        canvas.classList.remove('empty');
        let inner = '<div class="isotope-wrapper--late" data-gutter="20" data-filter-layout="fitRows" style="--col:1">';
        //search
        inner += '<div class="brxc-overlay__search-box"><input type="search" class="iso-search" name="typography-search" placeholder="Type here to filter the history list" data-type="textContent"><div class="iso-reset"><i class="bricks-svg ti-close"></i></div></div>';
        //container
        inner += '<div class="isotope-container">';
        if(self.aihistory.length < 1) return;
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        for(let i=0; i<self.aihistory.length; i++){
            const diff = self.aihistory[i]['user']['date'] - Date.now();
            let unit = "second";
            let divider = 1000;
            if (diff / 1000 < -59) {
                unit = "minute";
                divider = 60000;
            }
            if (diff / 1000 / 60 < -59) {
                unit = "hour";
                divider = 3600000;
            }
            if (diff / 1000 / 60 / 60 < -23) {
                unit = "day";
                divider = 86400000;
            }
            const time = rtf.format(Math.round(diff / divider), unit);
            inner += `
            <div class="brxc-ai-response-wrapper isotope-selector brxc-isotope__col">
                <input type="radio" id="brxcHistoryUser${i}" name="openai-results">
                <label for="brxcHistoryUser${i}" class="brxc-input__label">
                    <div class="brxc-history__header-wrapper">
                        <div class="brxc-history__header-wrapper--left">
                            <span><i class="fas fa-user"></i>You <span class="brxc__light">(${time})</span></span>
                        </div>
                        <div class="brxc-history__header-wrapper--right">`;
                            if(self.aihistory[i]['user']['type']){
                                inner += `
                                <div class="brxc-history__header-block" data-balloon="Category" data-balloon-pos="top">
                                    <i class="bricks-svg fas fa-tag"></i>
                                    <span>${self.aihistory[i]['user']['type']}</span>
                                </div>`;
                            }
                            if(self.aihistory[i]['user']['choices']){
                                inner += `
                                <div class="brxc-history__header-block" data-balloon="Choices" data-balloon-pos="top">
                                    <i class="bricks-svg fas fa-list-ul"></i>
                                    <span>${self.aihistory[i]['user']['choices']}</span>
                                </div>`;
                            }
                            if (self.aihistory[i]['user']['maxTokens']){
                                inner += `<div class="brxc-history__header-block" data-balloon="Max Tokens" data-balloon-pos="top">
                                    <i class="bricks-svg fas fa-traffic-light"></i>
                                    <span>${self.aihistory[i]['user']['maxTokens']} tokens</span>
                                </div>`;
                            }
                            if (typeof self.aihistory[i]['assistant']['usage'] != 'undefined'){
                                if(self.aihistory[i]['assistant']['usage']['prompt_tokens']){
                                inner += `<div class="brxc-history__header-block" data-balloon="Tokens used" data-balloon-pos="top">
                                    <i class="bricks-svg fas fa-dollar-sign"></i>
                                    <span>${self.aihistory[i]['assistant']['usage']['prompt_tokens']} tokens</span>
                                </div>`;
                                }
                            }
                        inner +=`</div>
                    </div>`;
                    
                    inner +=` <div name="${prefix}-prompt-response" class="message assistant">${self.aihistory[i]['user']['message']}</div>`;
                    
                inner +=`</label>`;
                if(self.aihistory[i]['user']['instruction']){
                    inner += `
                    <input type="radio" id="brxcHistoryInstruction${i}" name="openai-results">
                    <label for="brxcHistoryInstruction${i}" class="brxc-input__label">
                        <div name="${prefix}-prompt-response" class="message assistant">${self.aihistory[i]['user']['instruction']}</div>
                    </label>`;
                }
            inner += `</div>`;
            inner += '<div class="brxc-ai-response-wrapper isotope-selector brxc-isotope__col">';
            if(typeof self.aihistory[i]['assistant']['choices'] != 'undefined'){  
                for(let j=0; j<self.aihistory[i]['assistant']['choices'].length; j++){
                    
                    inner += `
                        <input type="radio" id="brxcHistoryAssistant${i + "c" +  j}" name="openai-results">
                        <label for="brxcHistoryAssistant${i + "c" +  j}" class="brxc-input__label">
                            <div class="brxc-history__header-wrapper">
                                <div class="brxc-history__header-wrapper--left">`
                                if(j===0) inner +=`<span><i class="fas fa-robot"></i>AI assistant <span class="brxc__light">(${time})</span></span>`;
                                inner +=`</div>
                                <div class="brxc-history__header-wrapper--right">`;
                                    if(j===0 && self.aihistory[i]['user']['temperature']){
                                        inner += `
                                        <div class="brxc-history__header-block" data-balloon="Temperature" data-balloon-pos="top">
                                            <i class="bricks-svg fas fa-temperature-empty"></i>
                                            <span>${self.aihistory[i]['user']['temperature']}</span>
                                        </div>`;
                                    }
                                    if(j===0 && self.aihistory[i]['user']['top_p']){
                                        inner += `
                                        <div class="brxc-history__header-block" data-balloon="Top Probability" data-balloon-pos="top">
                                            <i class="bricks-svg fas fa-arrow-up-1-9"></i>
                                            <span>${self.aihistory[i]['user']['top_p']}</span>
                                        </div>`;
                                    }
                                    if(j===0 && self.aihistory[i]['user']['presence_penalty']){
                                        inner += `
                                        <div class="brxc-history__header-block" data-balloon="Presence Penalty" data-balloon-pos="top">
                                            <i class="bricks-svg fas fa-signal"></i>
                                            <span>${self.aihistory[i]['user']['presence_penalty']}</span>
                                        </div>`;
                                    }
                                    if(j===0 && self.aihistory[i]['user']['frequency_penalty']){
                                        inner += `
                                        <div class="brxc-history__header-block" data-balloon="Frequency Penalty" data-balloon-pos="top">
                                            <i class="bricks-svg fas fa-wave-square"></i>
                                            <span>${self.aihistory[i]['user']['frequency_penalty']}</span>
                                        </div>`;
                                    }
                                    if (j===0 && typeof self.aihistory[i]['assistant']['usage'] != 'undefined' && self.aihistory[i]['assistant']['usage']['completion_tokens']){
                                        inner += `
                                        <div class="brxc-history__header-block" data-balloon="Tokens used" data-balloon-pos="top">
                                            <i class="bricks-svg fas fa-dollar-sign"></i>
                                            <span>${self.aihistory[i]['assistant']['usage']['completion_tokens']} tokens</span>
                                        </div>`;
                                    }
                                    inner += `</div>
                            </div>`;
                            if(self.aihistory[i]['user']['type'] === "completion" || self.aihistory[i]['user']['type'] === "code" || self.aihistory[i]['user']['type'] === "edit"){
                                inner += `<div name="${prefix}-prompt-response" class="message assistant">${self.aihistory[i]['assistant']['choices'][j]['message']['content'].trim()}</div>`;
                            } else {
                                inner += `<div name="${prefix}-prompt-response" class="message assistant">${self.aihistory[i]['assistant']['choices'][j]['text'].trim()}</div>`;
                            }
                        inner += '</label>';
                    
                }
            }
            if(self.aihistory[i]['user']['type'] === "images"){
                inner += `
                <input type="radio" id="brxcHistoryAssistant${i}" name="openai-results">
                <label for="brxcHistoryAssistant${i}" class="brxc-input__label">
                <div class="brxc-history__header-wrapper">
                    <div class="brxc-history__header-wrapper--left">
                        <span>AI assistant <span class="brxc__light">(${time})</span></span>
                    </div>
                </div>
                <div name="${prefix}-prompt-response" class="message assistant">I successfully generated ${self.aihistory[i]['user']['choices']} image(s)</div>`;
            }
            inner += '</div>';
        }
        //end of container and wrapper
        inner += '</div></div>';

        canvas.innerHTML = inner;


        let filterRes = true;
        let filterSearch = true;
        let qsRegex
        let isotopeGutter;
        let isotopeLayoutHelper;
        const isotopeWrappers = document.querySelectorAll(overlay + ' .isotope-wrapper--late')
        isotopeWrappers.forEach(wrapper => {
            const isotopeContainers = wrapper.querySelectorAll('.isotope-container');
            isotopeContainers.forEach(isotopeContainer => {
                const isotopeSelector = wrapper.querySelectorAll('.isotope-selector');
                const isoSearch = wrapper.querySelector('input[type="search"].iso-search');
                const isoSearchType = isoSearch.dataset.type;
                const isoSearchReset = wrapper.querySelector('.iso-reset');
                if (wrapper.dataset.gutter) {
                    isotopeGutter = parseInt(wrapper.dataset.gutter);
                    wrapper.style.setProperty('--gutter', isotopeGutter + 'px');
                    isotopeSelector.forEach(elm => elm.style.paddingBottom = isotopeGutter + 'px');
                } else {
                    isotopeGutter = 0;
                };

                if (wrapper.dataset.filterLayout) {
                    isotopeLayoutHelper = wrapper.dataset.filterLayout;
                } else {
                    isotopeLayoutHelper = 'fitRows';
                };
                

                // init Isotope
                const isotopeOptions = {
                    itemSelector: '.isotope-selector',
                    layoutMode: isotopeLayoutHelper,
                    transitionDuration: 0,
                    filter: function(itemElem1, itemElem2) {
                        const itemElem = itemElem1 || itemElem2;
                        if(isoSearchType === "textContent") {
                            return qsRegex ? itemElem.textContent.match(qsRegex) : true;
                        } else {
                            filterSearch = qsRegex ? itemElem.getAttribute('title').match(qsRegex) : true;
                            return filterRes;
                        }
                    },
                };


                // Set the correct layout
                switch (isotopeLayoutHelper) {
                    case 'fitRows':
                    isotopeOptions.fitRows = {
                        gutter: isotopeGutter
                    };
                    break;
                    case 'masonry':
                    isotopeOptions.masonry = {
                        gutter: isotopeGutter
                    };
                    break;
                }

                // Search Filter
                const iso = new Isotope(isotopeContainer, isotopeOptions);
                
                if (isoSearch) {
                    isoSearch.addEventListener('keyup', self.debounce(() => {
                        qsRegex = new RegExp(isoSearch.value, 'gi');
                        iso.arrange();
                    }, 100));
                }
                if (isoSearchReset) {
                    isoSearchReset.onclick = () => {
                        isoSearch.value = '';
                        const clickEvent = new Event('keyup');
                        isoSearch.dispatchEvent(clickEvent);
                    }
                }



            })
            
        })
    },
    initGridGuide: function() {
        const self = this;
        const x = document.querySelector('#bricks-builder-iframe').contentWindow;
        const xGridWrapper = document.createElement('div');
        xGridWrapper.classList.add(...['brxc-grid-guide__wrapper','brxe-section']);
        const xGridContainer = document.createElement('div');
        xGridContainer.classList.add('brxe-container');
        const div = '<div></div>';
        xGridContainer.innerHTML += div.repeat(self.globalSettings.enableGridGuideCol);
        xGridWrapper.appendChild(xGridContainer);
        x.document.body.after(xGridWrapper);
    },
    gridGuide: (btn) => {
        const x = document.querySelector('#bricks-builder-iframe').contentWindow;
        let xGridWrapper = x.document.querySelector('.brxc-grid-guide__wrapper')
        xGridWrapper.classList.toggle('active');
        btn.classList.toggle('enabled');
    },
    XCode: (btn) => {
        const x = document.querySelector('#bricks-builder-iframe').contentWindow;
        const els = x.document.querySelectorAll('body main *, body footer *, body header *, body .brx-popup.builder *');
        if(!btn.classList.contains('enabled')){
            btn.classList.add('enabled');
            els.forEach(el=> {
                el.classList.add('x-mode-enabled');
            })
        } else {
            btn.classList.remove('enabled');
            els.forEach(el=> {
                el.classList.remove('x-mode-enabled');
            })
        }
    },
 
    contrast: (btn) => {
        const x = document.querySelector('#bricks-builder-iframe').contentWindow;
        if(!btn.classList.contains('enabled')){
            btn.classList.add('enabled');
            contrast.check();
        } else {
            btn.classList.remove('enabled');
            const failedEls = x.document.querySelectorAll('.brxc-contrast-failed');
            failedEls.forEach(el => el.classList.remove('brxc-contrast-failed'))
        }
    },

 
    darkMode: (btn) => {
        const x = document.querySelector('#bricks-builder-iframe').contentWindow;
        x.document.body.classList.toggle('brxc-dark');
        btn.classList.toggle('enabled');

    },
    addMenuItemtoToolbar: (classes, balloonText, balloonPosition, onClickFunction, iconHTML, toolbar, insertBeforeEl) => {
        const li = document.createElement('li');
        li.classList.add(classes);
        li.setAttribute('data-balloon', balloonText);
        li.setAttribute('data-balloon-pos', balloonPosition);
        li.setAttribute('onClick',onClickFunction)
        const span = document.createElement('span');
        span.classList.add('bricks-svg-wrapper');
        span.innerHTML += iconHTML;
        li.appendChild(span);
        toolbar.insertBefore(li,insertBeforeEl);
    },
    addIconToFields: (tag, classes, attrArr, balloonText, balloonPosition, onClickFunction, dataUsed, htmlEl, target, appendMethod) => {
        const li = document.createElement(tag);
        li.classList.add(...classes.split(' '));
        li.setAttribute('data-balloon', balloonText);
        li.setAttribute('data-balloon-pos',balloonPosition);
        if(attrArr && attrArr.length > 0){
            attrArr.forEach(attr => {
                const label = attr[0];
                const value = attr[1];
                li.setAttribute(label, value);
            })
        }
        // if (attr) li.setAttribute(attr, attrValue);
        li.setAttribute('onclick', onClickFunction);
        (dataUsed === true) ? li.setAttribute('data-used', 0) : '';
        li.innerHTML = htmlEl;
        if(appendMethod === 'after'){
            target.after(li);
        } else if (appendMethod === 'before'){
            target ? target.insertBefore(li, null) : console.log('No target to insert before.');
        } else if (appendMethod === 'child'){
            target ? target.appendChild(li) : console.log('No target to append child.') ;
        } 
    },
    addDynamicVariableIcon: function() {
        const self = this;
        setTimeout(() => {
            self.fields['CSSVariabe']['includedFields'].forEach(field => {
                let elements;
                if (typeof field === 'string') {
                    elements = Array.from(document.querySelectorAll(field));
                } else {
                    // Get elements with the selector
                    const filteredElements = Array.from(document.querySelectorAll(field.selector));
        
                    // Check if they have any of the specified child elements
                    elements = filteredElements.filter(el =>
                        field.hasChild.some(child => el.querySelector(child))
                    );
                }
        
                const wrappers = elements.filter(
                    item => !item.parentNode.closest(self.fields['CSSVariabe']['excludedFields'])
                );
                if (wrappers.length < 1) return;
                wrappers.forEach(wrapper => {
                    const modal = wrapper.querySelector('.brxc-toggle-modal');
                    if (modal) return;
                    self.addIconToFields(
                        'div',
                        'brxc-toggle-modal',
                        false,
                        'Select CSS Variable',
                        'top-right',
                        'ADMINBRXC.openModal(event.target.previousSibling, "#brxcVariableOverlay" )',
                        false,
                        "v",
                        wrapper.querySelector("input[type='text']"),
                        'after'
                    );
                });
            });
        }, 100);
    },
    setTextShortcutsWrapper: function(){
        const self = this;
        const panel = document.querySelector("#bricks-panel-element");

        if(
            self.vueGlobalProp.$_state.activePanel === "element"
            && self.vueGlobalProp.$_state.activePanelTab === "content"
            && (
                Object.values(self.globalSettings.elementFeatures).includes("lorem-ipsum") // lorem
                || self.helpers.isAIActive() && self.globalSettings.isAIApiKeyEmpty === "0" // AI
            )
        ){
            setTimeout(() => {
                const fields = panel.querySelectorAll('[data-control="textarea"], [data-control="text"]');
                fields.forEach(field => {
                    if(!field.querySelector('.brxc-icon-wrapper')){
                        const div = document.createElement('DIV');
                        div.classList.add('brxc-icon-wrapper');
                        field.appendChild(div)
                    } 
                })
            }, 50)
        }
    },
    addDynamicLoremIcon: function() {
        const self = this;
        setTimeout(() => {
            self.fields['loremIpsum']['includedFields'].forEach(field => {
                let elements;
                if (typeof field === 'string') {
                    elements = Array.from(document.querySelectorAll(field));
                } else {
                    // Get elements with the selector
                    const filteredElements = Array.from(document.querySelectorAll(field.selector));
    
                    // Check if they have the specified child element
                    elements = filteredElements.filter(el =>
                        el.querySelector(field.hasChild)
                    );
                }
    
                const wrappers = elements.filter(
                    item =>
                        !item.parentNode.querySelector(self.fields['loremIpsum']['excludedFields']) &&
                        !item.parentNode.closest(self.fields['loremIpsum']['excludedFields'])
                );
                if (wrappers.length < 1) return;
                wrappers.forEach(wrapper => {
                    //setTimeout(() => {
                        const inputs = wrapper.querySelectorAll('.brxc-toggle-lorem');
                        if (inputs.length > 0) return;
                        const textWrapper = wrapper.querySelector('.brxc-icon-wrapper')
                        if (!textWrapper) return;
                        self.addIconToFields(
                            'div',
                            'brxc-toggle-lorem',
                            false,
                            'Add Dummy Content',
                            'top-right',
                            'ADMINBRXC.addLorem(event.target.parentElement.parentElement.querySelector("textarea,input"), this)',
                            true,
                            "<div class='lorem-wrapper'><div class='lorem-line lorem-line-1'></div><div class='lorem-line lorem-line-2'></div><div class='lorem-line lorem-line-3'></div>",
                            textWrapper,
                            'child'
                        );
                    //},10)
                });
            });
        }, 55);
    },
    addDynamicAIIcon: function() {
        const self = this;
        setTimeout(() => {
            self.fields['openAI']['includedFields'].forEach(field => {
                let elements;
                if (typeof field === 'string') {
                    elements = Array.from(document.querySelectorAll(field));
                } else {
                    // Get elements with the selector
                    const filteredElements = Array.from(document.querySelectorAll(field.selector));
    
                    // Check if they have the specified child element
                    elements = filteredElements.filter(el =>
                        el.querySelector(field.hasChild)
                    );
                }
    
                const wrappers = elements.filter(
                    item =>
                        !item.parentNode.querySelector(self.fields['openAI']['excludedFields']) &&
                        !item.parentNode.closest(self.fields['openAI']['excludedFields'])
                );
                if (wrappers.length < 1) return;
                wrappers.forEach(wrapper => {
                    const inputs = wrapper.querySelectorAll('.brxc-toggle-ai');
                    if (inputs.length > 0) return;
                    const textWrapper = wrapper.querySelector('.brxc-icon-wrapper')
                    if (!textWrapper) return;
                    self.addIconToFields(
                        'div',
                        'brxc-toggle-ai',
                        false,
                        'Add AI Content',
                        'top-right',
                        'ADMINBRXC.openAIModal("openai",false,event.target.parentElement.parentElement.querySelector("textarea,input"), "#brxcopenAIOverlay" )',
                        false,
                        "<div class='ai-wrapper'><span class='ai-text'>AI</span></div>",
                        textWrapper,
                        'child'
                    );
                });
            });
        }, 60);
    },
    headerIconsState: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;

        const action = document.querySelector('#bricks-panel-element .actions');
        const isActive = (string, obj) => {
            for (const key in obj) {
                if (JSON.parse(JSON.stringify(key)).indexOf(string) !== -1) {
                  return true;
                }
            }
            return false;
        }
        const states = ['hover', 'before', 'active', 'focus', 'after'];
        states.forEach(state => {
            const item = action.querySelector(`.brxc-header-icon.brxc-header-icon__${state}`);
            if(!item) return;
            item.classList.remove('highlight');
            if(isActive(`:${state}`, self.vueGlobalProp.$_state.activeElement.settings)) item.classList.add('highlight');
        })
    },
    addPanelHeaderIcons: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        const arrow = document.querySelector('#bricks-toolbar ul.group-wrapper.left li.pseudo-classes')
        const icons = document.querySelectorAll('#bricks-panel-inner #bricks-panel-header ul.actions li.brxc-header-icon');
        const pseudoState = self.vueGlobalProp.$_state.pseudoClassActive;
        icons.forEach(icon => {
            icon.classList.remove('active');
            (icon.dataset.balloon === pseudoState) ? icon.classList.add('active') : '';
        });

        const wrapper = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions')
        if (Object.values(self.globalSettings.shortcutsIcons).includes('hover')){
            if(!self.vueGlobalProp.$_state.pseudoClasses.includes(':hover')) self.vueGlobalProp.$_state.pseudoClasses.push(':hover')
            const hoverIcon = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions .brxc-header-icon__hover');
            if (!hoverIcon) {
                wrapper ? self.addIconToFields('li','brxc-header-icon brxc-header-icon__hover', false, ':hover', 'bottom-right', 'ADMINBRXC.setHeaderState("li.brxc-header-icon__hover", ":hover");', true, '<span class="bricks-svg-wrapper"><i class="fas fa-arrow-pointer" title="fas fa-arrow-pointer"></i></span>', wrapper, 'child') : '';
            }
        }
        if (Object.values(self.globalSettings.shortcutsIcons).includes('before')){
            if(!self.vueGlobalProp.$_state.pseudoClasses.includes(':before')) self.vueGlobalProp.$_state.pseudoClasses.push(':before')
            const beforeIcon = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions .brxc-header-icon__before');
            if (!beforeIcon) {
                wrapper ? self.addIconToFields('li','brxc-header-icon brxc-header-icon__before', false, ':before', 'bottom-right', 'ADMINBRXC.setHeaderState("li.brxc-header-icon__before", ":before");', true, '<span class="bricks-svg-wrapper"><svg class="bricks-svg" viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"></path></svg></span>', wrapper, 'child') : '';
            }
        }
        if (Object.values(self.globalSettings.shortcutsIcons).includes('after')){
            if(!self.vueGlobalProp.$_state.pseudoClasses.includes(':after')) self.vueGlobalProp.$_state.pseudoClasses.push(':after')
            const afterIcon = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions .brxc-header-icon__after');
            if (!afterIcon) {
                wrapper ? self.addIconToFields('li','brxc-header-icon brxc-header-icon__after', false, ':after', 'bottom-right', 'ADMINBRXC.setHeaderState("li.brxc-header-icon__after", ":after");', true, '<span class="bricks-svg-wrapper"><svg class="bricks-svg" viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"></path></svg></span>', wrapper, 'child') : '';
            }
        }
        if (Object.values(self.globalSettings.shortcutsIcons).includes('active')){
            if(!self.vueGlobalProp.$_state.pseudoClasses.includes(':active')) self.vueGlobalProp.$_state.pseudoClasses.push(':active')
            const activeIcon = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions .brxc-header-icon__active');
            if (!activeIcon) {
                wrapper ? self.addIconToFields('li','brxc-header-icon brxc-header-icon__active', false, ':active', 'bottom-right', 'ADMINBRXC.setHeaderState("li.brxc-header-icon__active", ":active");', true, '<span class="bricks-svg-wrapper"><i class="fas fa-toggle-on" title="fas fa-toggle-on"></span>', wrapper, 'child') : '';
            }
        }
        if (Object.values(self.globalSettings.shortcutsIcons).includes('focus')){
            if(!self.vueGlobalProp.$_state.pseudoClasses.includes(':focus')) self.vueGlobalProp.$_state.pseudoClasses.push(':focus')
            const focusIcon = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions .brxc-header-icon__focus');
            if (!focusIcon) {
                wrapper ? self.addIconToFields('li','brxc-header-icon brxc-header-icon__focus', false, ':focus', 'bottom-right', 'ADMINBRXC.setHeaderState("li.brxc-header-icon__focus", ":focus");', true, '<span class="bricks-svg-wrapper"><i class="fas fa-crosshairs" title="fas fa-crosshairs"></span>', wrapper, 'child') : '';
            }
        }
    },
    filterActiveSettings: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        const panel = document.querySelector('#bricks-panel-element');
        const icon = panel.querySelector('#bricks-panel-header ul.actions .brxc-header-icon.brxc-header-icon__setting');
        panel.removeAttribute('data-filter');
        icon.addEventListener('click', () => {
            icon.classList.toggle('active');
            const fields = panel.querySelectorAll('[data-controlkey], [data-control] .control');
            if(icon.classList.contains('active')){
                panel.setAttribute('data-filter', 'true');
                fields.forEach(el => {
                    const hasIndicator = el.querySelector('span.has-setting');
                    if (hasIndicator) {
                        el.classList.add('brxc-filter-active-elements')
                    }
                });
            } else {
                panel.removeAttribute('data-filter');
                fields.forEach(el => { el.classList.remove('brxc-filter-active-elements')});
            }
        })
    },
    // setFilterActiveSettings: function(){
    //     const self = this;
    //     if(self.vueGlobalProp.$_state.activePanel !== "element") return;
    //     const wrapper = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions');
    //     if(!wrapper) return;
    //     //if(Object.values(self.globalSettings.classFeatures).includes("extend-classes")){
    //     if(Object.values(self.globalSettings.classFeatures)){
    //         const settingIcon = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions .brxc-header-icon__setting');
    //         if (!settingIcon) {
    //             wrapper ? self.addIconToFields('li','brxc-header-icon brxc-header-icon__setting', false, 'Filter Active Settings', 'bottom-right', 'ADMINBRXC.filterActiveSettings()', true, '<span class="bricks-svg-wrapper"><i class="fas fa-gear" title="fas fa-gear"></span>', wrapper, 'child') : '';
    //         }
    //     }
    // },
    setExtendClass(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        const wrapper = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions');
        if(!wrapper) return;
        if(Object.values(self.globalSettings.classFeatures).includes("extend-classes")){
            const extendIcon = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions .brxc-header-icon__extend');
            if (!extendIcon) {
                wrapper ? self.addIconToFields('li','brxc-header-icon brxc-header-icon__extend', false, 'Extend Classes & Styles', 'bottom-right', 'ADMINBRXC.openExtendClassModal(event,"#brxcExtendModal")', true, '<span class="bricks-svg-wrapper"><svg xmlns="http://www.w3.org/2000/svg" class="bricks-svg" viewBox="0 96 960 960"><path d="M145 1022v-95h670v95H145Zm337-125L311 726l58-59 72 72V413l-72 72-58-59 171-171 172 171-59 59-72-72v326l72-72 59 59-172 171ZM145 225v-95h670v95H145Z"/></svg></span>', wrapper, 'child') : '';
            }
        }
    },
    setFindReplace(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        const wrapper = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions');
        if(!wrapper) return;
        if(Object.values(self.globalSettings.classFeatures).includes("find-and-replace")){
            const findReplaceIcon = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions .brxc-header-icon__find-replace');
            if (!findReplaceIcon) {
                wrapper ? self.addIconToFields('li','brxc-header-icon brxc-header-icon__find-replace', false, 'Find & Replace Styles', 'bottom-right', 'ADMINBRXC.openFindReplaceModal(event,false, "#brxcFindReplaceModal")', true, '<span class="bricks-svg-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="bricks-svg"><path xmlns="http://www.w3.org/2000/svg" d="M138 484q18-110 103.838-182T440 230q75 0 133 30.5t98 82.5v-98h72v239H503v-71h100q-27-42-70.5-65T440 325q-72.187 0-130.093 43.5Q252 412 234 484h-96Zm674 492L615 780q-34 27-78 43.5T440.217 840Q367 840 308.5 813 250 786 209 734v93h-72V588h240v71H271q28.269 41.15 72.541 64.075Q387.812 746 440 746q72.102 0 127.444-44.853T642 588h96q-5 33-19 65.5T684 713l197 196-69 67Z"/></svg></span>', wrapper, 'child') : '';
            }
        }
    },
    setGoToParentElement: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        const wrapper = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions');
        if(!wrapper) return;
        const goToParentIcon = document.querySelector('#bricks-panel-inner #bricks-panel-header ul.actions .brxc-header-icon__parent');
        if (goToParentIcon && typeof self.vueGlobalProp.$_state.activeElement !== "undefined" && self.vueGlobalProp.$_state.activeElement.hasOwnProperty('parent') && self.vueGlobalProp.$_state.activeElement.parent === 0) {
            goToParentIcon.remove();
        } else if (!goToParentIcon && typeof self.vueGlobalProp.$_state.activeElement !== "undefined" && self.vueGlobalProp.$_state.activeElement.hasOwnProperty('parent') && self.vueGlobalProp.$_state.activeElement.parent != 0) {
            self.addIconToFields('li','brxc-header-icon brxc-header-icon__parent', false, 'Go to Parent Element', 'bottom-right', 'ADMINBRXC.goToParentElement()', true, '<span class="bricks-svg-wrapper"><i class="fas fa-arrow-turn-up" title="fas fa-arrow-turn-up"></span>', wrapper, 'child');
        }
    },
    goToParentElement: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        self.vueGlobalProp.$_state.activeId = self.vueGlobalProp.$_state.activeElement.parent;
    },
    setHeaderState: function(target, text) {
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        const icons = document.querySelectorAll('#bricks-panel-header ul.actions li')
        const icon = document.querySelector('#bricks-panel-header ' + target);

        // If icon is active
        if (icon.classList.contains('active')){
            self.vueGlobalProp.$_state.pseudoClassPopup = false;
            icons.forEach(li => li.classList.remove('active'));
            return;
        }

        // If Icon is inactive
        icons.forEach(li => li.classList.remove('active'));
        icon.classList.add('active');
        const pseudoList = self.vueGlobalProp.$_state.pseudoClasses;
        let isPseudoMatching = false;
        for(var i=0; i<pseudoList.length; i++) {
            if(pseudoList[i].indexOf(text)!=-1) {
                isPseudoMatching = true;
            }
        }
        if (isPseudoMatching === true){
            self.vueGlobalProp.$_state.pseudoClassPopup = true;
            self.vueGlobalProp.$_state.pseudoClassActive = text
        }
    },
    setDynamicColorOnHover: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        const x = document.querySelector('#bricks-builder-iframe').contentWindow;
        const activeElementID = '#brxe-' + self.vueGlobalProp.$_state.activeElement.id;
        const active = x.document.querySelector(activeElementID);
        setTimeout(()=> {
            self.fields['colorsOnHover']['includedFields'].forEach(field => {
                const colors = Array.from(document.querySelectorAll(field));
                colors.forEach(color => {
                    color.onmouseenter = () => {        
                        if (color.parentNode.closest('[data-control="typography"]')) active.style.color = window.getComputedStyle( color.childNodes[0] ,null).getPropertyValue('background-color');
                        if (color.parentNode.closest('[data-control="background"]')) active.style.backgroundColor = window.getComputedStyle( color.childNodes[0] ,null).getPropertyValue('background-color');
                        if (color.parentNode.closest('[data-control="border"]')) active.style.borderColor = window.getComputedStyle( color.childNodes[0] ,null).getPropertyValue('background-color');
                    }
                    color.onmouseleave = () => {          
                        if (color.parentNode.closest('[data-control="typography"]')) active.style.color = '';
                        if (color.parentNode.closest('[data-control="background"]')) active.style.backgroundColor = '';
                        if (color.parentNode.closest('[data-control="border"]')) active.style.borderColor = '';
                    }
                })
            })
        },0)
    },
    setDynamicClassOnHover: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        const activeId = self.vueGlobalProp.$_state.activeElement.id;
        const x = document.querySelector('#bricks-builder-iframe').contentWindow;
        setTimeout(()=> {
            const self = this;
            const activeElementID = '#brxe-' + activeId ;
            const active = x.document.querySelector(activeElementID);
            const titleArr = document.querySelectorAll('div.bricks-control-popup > div.css-classes > h6');
            if(titleArr.length < 1 ) return;
            const title = titleArr[titleArr.length - 1];
            if(!title) return;
            const ul = title.nextElementSibling;
            const globalClasses = ul.querySelectorAll('li');
            globalClasses.forEach(singleClass => {
                singleClass.onmouseenter = () => {    
                    const sClass = singleClass.querySelector('div.actions')
                    if (!sClass) return;
                    const sibling = sClass.previousElementSibling;
                    const name = sibling.textContent;      
                    active.classList.add(name.substring(1));
                };
                singleClass.onmouseleave = () => { 
                    const sClass = singleClass.querySelector('div.actions')
                    if (!singleClass) return;
                    const sibling = sClass.previousElementSibling;
                    const name = sibling.textContent;       
                    active.classList.remove(name.substring(1));
                }
                singleClass.onclick = () => { 
                    const sClass = singleClass.querySelector('div.actions')
                    if (!singleClass) return;
                    const sibling = sClass.previousElementSibling;
                    const name = sibling.textContent;       
                    active.classList.remove(name.substring(1));
                }
            })
        },0)
    },
    setIsotope: function() {
        const self = this;
        let filterRes = true;
        let filterSelector = "*";
        let filterSearch = true;
        let qsRegex
        let isotopeGutter;
        let isotopeLayoutHelper;
        const isotopeWrappers = document.querySelectorAll('.isotope-wrapper')
        isotopeWrappers.forEach(wrapper => {
            const isotopeContainers = wrapper.querySelectorAll('.isotope-container');
            isotopeContainers.forEach(isotopeContainer => {
                const isotopeSelector = wrapper.querySelectorAll('.isotope-selector');
                const isoSearch = wrapper.querySelector('input[type="search"].iso-search');
                const isoSearchType = isoSearch.dataset.type;
                const isoSearchReset = wrapper.querySelector('.iso-reset');
                if (wrapper.dataset.gutter) {
                    isotopeGutter = parseInt(wrapper.dataset.gutter);
                    wrapper.style.setProperty('--gutter', isotopeGutter + 'px');
                    isotopeSelector.forEach(elm => elm.style.paddingBottom = isotopeGutter + 'px');
                } else {
                    isotopeGutter = 0;
                };

                if (wrapper.dataset.filterLayout) {
                    isotopeLayoutHelper = wrapper.dataset.filterLayout;
                } else {
                    isotopeLayoutHelper = 'fitRows';
                };
                

                // init Isotope
                const isotopeOptions = {
                    itemSelector: '.isotope-selector',
                    layoutMode: isotopeLayoutHelper,
                    transitionDuration: 0,
                    filter: function(itemElem1, itemElem2) {
                        const itemElem = itemElem1 || itemElem2;
                        if(isoSearchType === "textContent") {
                            return qsRegex ? itemElem.textContent.match(qsRegex) : true;
                        } else {
                            filterSearch = qsRegex ? itemElem.getAttribute('title').match(qsRegex) : true;
                            filterRes = filterSelector != '*' ? itemElem.dataset.filter.includes(filterSelector) : true;
                            return filterSearch && filterRes;
                        }
                    },
                };


                // Set the correct layout
                switch (isotopeLayoutHelper) {
                    case 'fitRows':
                    isotopeOptions.fitRows = {
                        gutter: isotopeGutter
                    };
                    break;
                    case 'masonry':
                    isotopeOptions.masonry = {
                        gutter: isotopeGutter
                    };
                    break;
                }

                // Search Filter
                const iso = new Isotope(isotopeContainer, isotopeOptions);
                
                if (isoSearch) {
                    isoSearch.addEventListener('keyup', self.debounce(() => {
                        qsRegex = new RegExp(isoSearch.value, 'gi');
                        iso.arrange();
                    }, 100));
                }
                if (isoSearchReset) {
                    isoSearchReset.onclick = () => {
                        isoSearch.value = '';
                        const clickEvent = new Event('keyup');
                        isoSearch.dispatchEvent(clickEvent);
                    }
                }

                // Buttons Filters
                const filtersElem = wrapper.querySelectorAll(".filterbtn");
                if (filtersElem.length > 0) {
                    filtersElem.forEach(elem => elem.addEventListener("click", function (event) {
                        event.preventDefault();
                        var filterValue = event.target.getAttribute("data-filter");
                        filterSelector = filterValue;
                        iso.arrange();
                    }));
                };

                const radioButtonGroup = (buttonGroup) => {
                    buttonGroup.addEventListener("click", function (event) {
                    filtersElem.forEach(btn => btn.classList.remove("active"));
                    event.target.classList.add("active");
                    });
                };

                for (var i = 0, len = filtersElem.length; i < len; i++) {
                    var buttonGroup = filtersElem[i];
                    radioButtonGroup(buttonGroup);
                };

                // Hide if empty
                iso.on('arrangeComplete', (event) => {
                    if (event.length === 0 ) {
                        isotopeContainer.style.display = "none";
                        (isotopeContainer.previousElementSibling) ? isotopeContainer.previousElementSibling.style.display = "none" : '';
                    } else {
                        isotopeContainer.style.display = "flex";
                        (isotopeContainer.previousElementSibling) ? isotopeContainer.previousElementSibling.style.display = "block" : '';
                    }
                })



            })
            

            //setTimeout(() => iso.arrange({filter: '*'}), 300)
        })
    },
    openInnerWindow: (wrapper) => {
        wrapper.classList.toggle('inner');
    },
    setInnerContent: (el) => {
        const imgCanvas = document.querySelector('#brxcResourcesOverlay .brxc-overlay__pannel-2 .brxc-overlay__img');
        const titleCanvas = document.querySelector('#brxcResourcesOverlay .brxc-overlay__pannel-2 .brxc-overlay__header-title');
        const srcImg = el.childNodes[1].src;
        const titleText = el.getAttribute('title');
        imgCanvas.innerHTML = '<img src="' + srcImg + '" class="inner__img">';
        titleCanvas.textContent = titleText;
    },
    copytoClipboardSimple: function(text, successMsg) {
        const self = this;
        if (window.isSecureContext && navigator.clipboard) {
           navigator.clipboard.writeText(text);
           self.vueGlobalProp.$_showMessage(successMsg)
        } else {
            self.unsecuredCopyToClipboardSimple(text, successMsg);
        }
     },
     unsecuredCopyToClipboardSimple: function(text, successMsg) {
        const self = this;
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus({
           preventScroll: true
        });
        textArea.select();
        try {
           document.execCommand('copy');
           self.vueGlobalProp.$_showMessage(successMsg);
        } catch (err) {
            alert('Unable to copy to clipboard - Use a secure environment.')
        }
        document.body.removeChild(textArea);
     },
    copytoClipboard: function(btn,target, copytext, resestText) {
        const self = this;
        if (window.isSecureContext && navigator.clipboard) {
           navigator.clipboard.writeText(target);
           btn.textContent = copytext;
           setTimeout(() => {
                btn.textContent = resestText;
           }, 1000)
        } else {
            self.unsecuredCopyToClipboard(btn,target,copytext, resestText);
        }
     },
     unsecuredCopyToClipboard: (btn,text,copytext, resestText) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus({
           preventScroll: true
        });
        textArea.select();
        try {
           document.execCommand('copy');
           btn.textContent = copytext;
           setTimeout(() => {
                btn.textContent = resestText;
           }, 1000)
        } catch (err) {
            alert('Unable to copy to clipboard - Use a secure environment.')
        }
        document.body.removeChild(textArea);
     },
    codeMirrorOptions: (textarea) => {
        let builderTheme;
        (typeof bricksData["loadData"] !== "undefined" && bricksData["loadData"].hasOwnProperty("globalClasses") && bricksData["loadData"]['globalSettings'].hasOwnProperty("builderMode") && bricksData['loadData']['globalSettings']['builderMode'] === 'light') ? builderTheme = 'default' : builderTheme = 'one-dark';
        const obj = {
            value: textarea.value,
            mode: "css",
            theme: builderTheme,
            readOnly: false,
            styleActiveLine: true,
            tabSize: 2,
            lineNumbers: true,
            lineWrapping: !0,
            autoRefresh: !0,
            autofocus: true,
            suppressErrorLogging: !1,
            autoCloseBrackets: true,
            matchBrackets: true,
            gutters: ["CodeMirror-lint-markers"],
            selfContain: true,
            //highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
            extraKeys: { Tab: "emmetExpandAbbreviation", Esc: "emmetResetAbbreviation", Enter: "emmetInsertLineBreak" },
        };
        return obj;
    },
    setCodeMirror: function() {
        const self = this;
        const customCSS = document.querySelector("#brxcCustomCSS");
        const customGlobalCSS = document.querySelector("#brxcCustomGlobalCSS");
        const PlainClasses = document.querySelector("#plainClassesInput");
        let pageCSS = self.vueGlobalProp.$_state.pageSettings.customCss;
        let globalCSS = self.vueGlobalProp.$_state.globalSettings.customCss;

        const codemirrors = document.querySelectorAll("#brxcCSSOverlay.brxc-overlay__wrapper .brxc-codemirror__imported")
        if (customCSS && pageCSS) {
            customCSS.innerHTML = pageCSS
        } else if(customCSS){
            customCSS.innerHTML = '';
        }
        if (customGlobalCSS && globalCSS) {
            customGlobalCSS.innerHTML = globalCSS;
        } else if (customGlobalCSS){
            customGlobalCSS.innerHTML = '';
        }

        [customCSS, customGlobalCSS, PlainClasses, ...codemirrors].forEach(textarea => {
            if (!textarea) return;
            const myCodeMirror = CodeMirror(function(elt) {
                textarea.parentNode.replaceChild(elt, textarea);
            }, self.codeMirrorOptions(textarea));

            if(textarea === customCSS){
                myCodeMirror.setOption("lint", CodeMirror.lint.css);
                myCodeMirror.setOption('autoCloseBrackets', "[]{}''\"\"")
                myCodeMirror.on('change', () => {
                    
                    // SASS
                    //
                    // var sass = new Sass();
                    // Sass.compile(myCodeMirror.getValue(), function(result) {
                    //     console.log(result);
                    //     self.vueGlobalProp.$_state.pageSettings.customCss = result.text;
                    // });
                    // self.vueGlobalProp.$_state.pageSettings.customSass = myCodeMirror.getValue();

                    self.vueGlobalProp.$_state.pageSettings.customCss = myCodeMirror.getValue();
                });
                myCodeMirror.on("keyup", function (cm, event) {
                    if (!cm.state.completionActive &&
                        event.keyCode >= 65 &&
                        event.keyCode <= 90 || 
                        event.keyCode == 56 || 
                        event.keyCode == 189) {
                        CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
                    }
                });
            } else if(textarea === customGlobalCSS){
                myCodeMirror.setOption("lint", CodeMirror.lint.css);
                myCodeMirror.setOption('autoCloseBrackets', "[]{}''\"\"")
                myCodeMirror.on('change', () => {
                    self.vueGlobalProp.$_state.globalSettings.customCss = myCodeMirror.getValue();
                });
                myCodeMirror.on("keyup", function (cm, event) {
                    if (!cm.state.completionActive &&
                        event.keyCode >= 65 &&
                        event.keyCode <= 90 || 
                        event.keyCode == 56 || 
                        event.keyCode == 189) {
                        CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
                    }
                });
            } else if(textarea === PlainClasses){
                document.querySelector('#brxcPlainClassesOverlay .CodeMirror').CodeMirror.getMode().name = "text/x-markdown";
                myCodeMirror.setOption('lineNumbers', false);
                myCodeMirror.setOption('autoCloseBrackets', false);
                myCodeMirror.setOption('matchBrackets', false);
                myCodeMirror.setOption('gutters', false);
                myCodeMirror.setOption('lint', false);
                myCodeMirror.setOption('highlightSelectionMatches', false);
                myCodeMirror.setOption("placeholder",'Type your classes here...');
                myCodeMirror.on("keyup", function (cm, event) {
                    if (!cm.state.completionActive && 
                        event.keyCode >= 46 &&
                        event.keyCode <= 90 ||
                        event.keyCode == 109 || event.keyCode == 189) { 
                        CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
                    }
                });
                myCodeMirror.on("beforeChange", function(cm, changeObj) {
                    var typedNewLine = changeObj.origin == '+input' && typeof changeObj.text == "object" && changeObj.text.join("") == "";
                    if (typedNewLine) {
                        return changeObj.cancel();
                    }
                
                    var pastedNewLine = changeObj.origin == 'paste' && typeof changeObj.text == "object" && changeObj.text.length > 1;
                    if (pastedNewLine) {
                        var newText = changeObj.text.join(" ");
                        return changeObj.update(null, null, [newText]);
                    }
                
                    return null;
                });
            } else {
                myCodeMirror.options['readOnly'] = true;
            }

            CodeMirror.hint.anyword = function (editor) {
                var list = self.globalClasses();
                var cursor = editor.getCursor();
                var currentLine = editor.getLine(cursor.line);
                var start = cursor.ch;
                var end = start;
                var reg = /[\w\-$]+/;
                while (end < currentLine.length && reg.test(currentLine.charAt(end))) ++end;
                while (start && reg.test(currentLine.charAt(start - 1))) --start;
                var curWord = start != end && currentLine.slice(start, end);
                var regex = new RegExp('^' + curWord, 'i');
                var result = {
                    list: (!curWord ? list : list.filter(function (item) {
                        return item.match(regex);
                    })).sort(),
                    from: CodeMirror.Pos(cursor.line, start),
                    to: CodeMirror.Pos(cursor.line, end)
                };

                return result;
            }
            const cssHinter = CodeMirror.hint.css;
            CodeMirror.hint.css = function (editor) {
                const cursor = editor.getCursor();
                const currentLine = editor.getLine(cursor.line);
                let start = cursor.ch;
                let end = start;
                const rex= /[\w\-$]+/; // a pattern to match any characters in our hint "words"
                // Our hints include function calls, e.g. "trap.getSource()"
                // so we search for word charcters (\w) and periods.
                // First (and optional), find end of current "word" at cursor...
                while (end < currentLine.length && rex.test(currentLine.charAt(end))) ++end;
                // Find beginning of current "word" at cursor...
                while (start && rex.test(currentLine.charAt(start - 1))) --start;
                // Grab the current word, if any...
                const curWord = start !== end && currentLine.slice(start, end);
                // Get the default results object from the JavaScript hinter...
                const dflt=cssHinter(editor);
                // If the default hinter didn't hint, create a blank result for now...
                const result = dflt || {list: []};
                // Set the start/end of the replacement range...
                result.to=CodeMirror.Pos(cursor.line, end);
                result.from=CodeMirror.Pos(cursor.line, start);
                // Add our custom hintWords to the list, if they start with the curWord...
                self.cssVariables.forEach(h=>{if (h.includes(curWord)) result.list.push(h);});
                result.list = [...new Set(result.list)];
                result.list.sort(); // sort the final list of hints
                return result;
            }


            CodeMirror.commands.autocomplete = function(cm) {
                var doc = cm.getDoc();
                var POS = doc.getCursor();
                var mode = CodeMirror.innerMode(cm.getMode(), cm.getTokenAt(POS).state).mode.name;
                if (mode == 'css') {
                    cm.showHint(
                        {
                            hint: CodeMirror.hint.css,
                            completeSingle: false,
                        }
                    )
                } else if(mode == 'text/x-markdown') {
                    cm.showHint(
                        {
                            hint: CodeMirror.hint.anyword,
                            completeSingle: false,
                        }
                    )
                } else if(mode == 'cssVariables') {
                    cm.showHint(
                        {
                            hint: CodeMirror.hint.cssVariables,
                            completeSingle: false,
                        }
                    )
                }
            }
        });
        (self.helpers.isClassesAndStylesTabActive('advanced-css')) ? self.switchCodePanels() : '';
    },
    setNewCodeMirror: function(target){
        const self = this;
        const myCodeMirror = CodeMirror(function(elt) {
            target.parentNode.replaceChild(elt, target);
        }, self.codeMirrorOptions(target));
    },
    switchCodePanels: function() {
        const self = this;
        const labels = document.querySelectorAll('#brxcCSSOverlay.brxc-overlay__wrapper .brxc-overlay__panel-switcher-wrapper > [data-code]');
        const colRight = document.querySelector('#brxcCSSOverlay.brxc-overlay__wrapper #brxcCSSColRight');
        const panels = colRight.querySelectorAll('.brxc-overlay-css__wrapper');
        labels.forEach(label => {
            label.onclick = () => {
                labels.forEach(label => {label.classList.remove('active')})
                panels.forEach(panel => {panel.classList.remove('active')})
                label.classList.add('active');
                const attr = label.dataset.code;
                const panel = colRight.querySelector('[data-code="'+ attr +'"]');
                panel.classList.add('active');
                const editor= panel.querySelector('.CodeMirror');
                if (editor) editor.CodeMirror.refresh();
                self.movePanel(document.querySelector('#brxcCSSOverlay .brxc-overlay__pannels-wrapper'), label.dataset.transform);

            };
        })
    },
    lastElementId: '',
    forceClassStlyes: function (){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;

        const panel = document.querySelector('#bricks-panel-element');
        if(!panel) return;
        const tabs = panel.querySelector('ul#bricks-panel-tabs');
        if (!tabs) return;

        if (self.helpers.isClassActive()) {
            self.vueGlobalProp.$_state.brxc.showLock = false;
            self.lastElementId = '';
        } else if (self.lastElementId !== self.vueGlobalProp.$_state.activeElement.id){
            self.vueGlobalProp.$_state.brxc.showLock = true
            self.lastElementId = self.vueGlobalProp.$_state.activeElement.id;
        }
        const styleTab = tabs.querySelectorAll('li')[1];
        const icon = panel.querySelector('.disabled-style-icon');
        (icon) ? icon.remove() : '';

        panel.setAttribute("data-has-class", "true")
        styleTab.classList.remove('brxc-style-tab-disabled')

        //if state brxc.showLock is true
        if(self.vueGlobalProp.$_state.brxc.showLock === true) {
            panel.removeAttribute("data-has-class");
            self.vueGlobalProp.$_state.activePanelTab = "content";
            styleTab.classList.add('brxc-style-tab-disabled')
            self.addIconToFields('div','disabled-style-icon', false, 'Click to unlock styling on ID level', 'top-right', false, false,  '<span class="bricks-svg-wrapper"><i class="fas fa-lock" title="fas fa-lock"></span>', tabs, 'child');
            const icon = panel.querySelector('.disabled-style-icon')
            icon.addEventListener('click', () =>{
                self.vueGlobalProp.$_state.brxc.showLock = false;
                icon.remove();
            })

        }

    },
    setPlainClasses: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element" || self.helpers.isClassActive()) return;
        setTimeout(() => {
            const activeClasses = document.querySelector('#bricks-panel-element-classes .active-class')
            if(!activeClasses) return;

            const icon = activeClasses.querySelector('.plain-classes-icon');
            if (icon) return;

            self.addIconToFields('div','plain-classes-icon', false, 'Plain Classes', 'top-right', 'ADMINBRXC.openPlainClassesModal(event,document.querySelectorAll("#bricks-panel-element-classes ul.element-classes li span.name"), "#brxcPlainClassesOverlay", document.querySelector("#brxcPlainClassesOverlay .CodeMirror").CodeMirror )', false,  "<span class='symbol counter'>P</span>", activeClasses, 'child');
        }, 0);    
    },
    setCopyClassToClipboard: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        setTimeout(() => {
            const activeClasses = document.querySelector('#bricks-panel-element-classes .active-class');
            if(!activeClasses) return;

            const icon = activeClasses.querySelector('.copy-class-icon');
            if(icon) icon.remove();

            if(!self.helpers.isClassActive()) return;
            
            self.addIconToFields('div','copy-class-icon', false, 'Copy Class to Clipboard', 'top-right', `ADMINBRXC.copytoClipboardSimple('${self.vueGlobalProp.$_state.activeClass.name}','"${self.vueGlobalProp.$_state.activeClass.name}" successfully copied to clipboard')`, false,  '<span class="symbol counter"><i class="fas fa-clipboard"></i></span', activeClasses, 'child');
            const newIcon = activeClasses.querySelector('.copy-class-icon');
            newIcon.addEventListener('click', (e) => e.stopPropagation());
        }, 0); 

    },
    setCloneClass: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        setTimeout(() => {
            const activeClasses = document.querySelector('#bricks-panel-element-classes .active-class');
            if(!activeClasses) return;

            const icon = activeClasses.querySelector('.clone-class-icon');
            if(icon) icon.remove();

            if(!self.helpers.isClassActive()) return;
            
            self.addIconToFields('div','clone-class-icon', false, 'Clone class', 'top-right', 'ADMINBRXC.cloneClass()', false,  '<span class="symbol counter"><i class="fa-solid fa-clone"></i></span', activeClasses, 'child');
            const newIcon = activeClasses.querySelector('.clone-class-icon');
            newIcon.addEventListener('click', (e) => e.stopPropagation());
        }, 0); 

    },
    setexportIDStylestoClass: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        setTimeout(() => {
            const activeClasses = document.querySelector('#bricks-panel-element-classes .active-class');
            if(!activeClasses) return;

            const icon = activeClasses.querySelector('.copy-id-to-class-icon');
            if(icon) icon.remove();

            if(self.helpers.isClassActive()) return;
            
            self.addIconToFields('div','copy-id-to-class-icon', false, 'Export the styles to a class', 'top-right', 'ADMINBRXC.exportIDStylestoClass()', false,  "<span class='symbol counter'><i class='fas fa-file-export' title='fas fa-file-export'></i></span>", activeClasses, 'child');
            const newIcon = activeClasses.querySelector('.copy-id-to-class-icon');
            newIcon.addEventListener('click', (e) => e.stopPropagation());
        }, 0); 

    },
    setImportIDStylestoClass: function(){
        const self = this;

        if (self.vueGlobalProp.$_state.activePanel !== "element") return;

        setTimeout(() => {
            const activeClasses = document.querySelector('#bricks-panel-element-classes .active-class');
            if(!activeClasses) return;

            const icon = activeClasses.querySelector('.copy-class-to-id-icon');
            if(icon) icon.remove();

            if (!self.helpers.isClassActive() || self.vueGlobalProp.$_isLocked(self.vueGlobalProp.$_state.activeClass.id)) return;
            
            self.addIconToFields('div','copy-class-to-id-icon', false, 'Import styles from the ID element', 'top-right', '', false,  "<span class='symbol counter'><i class='fas fa-file-import' title='fas fa-file-import'></i></span>", activeClasses, 'child');
            const newIcon = activeClasses.querySelector('.copy-class-to-id-icon');
            newIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                self.vueGlobalProp.$_state.brxcShowImportInput = true;
                newIcon.remove();
            })

            if (self.vueGlobalProp.$_state.brxcShowImportInput === true){
                const newIconHTML = `<span class='symbol counter'><i class='fas fa-file-import' title='fas fa-file-import'></i></span>`;
                newIcon.innerHTML = `<span class='symbol counter'><i class='fas fa-check' title='fas fa-check'></i></span>`;
                newIcon.setAttribute("onClick", "ADMINBRXC.importIDStylestoClass();ADMINBRXC.vueGlobalProp.$_state.brxcShowImportInput = false");
                newIcon.setAttribute("data-balloon", "Confirm?");
                setTimeout(() => {
                    newIcon.innerHTML = newIconHTML;
                    self.vueGlobalProp.$_state.brxcShowImportInput = false
                }, 2000)
            }
        },0)
    },
    cloneClass: function(){
        const self = this;
        const els = document.querySelector('#bricks-panel-element-classes')
        if (!els) return;

        const wrapper = els.querySelector('.brxc-clone-class-wrapper')
        if(wrapper) return wrapper.remove();

        const activeClass = els.querySelector('.active-class');

        const inputHTML = `<div class="brxc-clone-class-wrapper"><input type="text" id="brxc-clone-class-input" size="999" autocomplete="off" spellcheck="false" placeholder="Type your class name here" value="${self.vueGlobalProp.$_state.activeClass.name}-new"><span class="bricks-svg-wrapper create" data-balloon="Clone class (SHIFT + ENTER)" data-balloon-pos="left"><!--?xml version="1.0" encoding="UTF-8"?--><svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="bricks-svg"><path d="M362.7,64h-256c-23.7,0 -42.7,19.2 -42.7,42.7v298.7c0,23.5 19,42.7 42.7,42.7h298.7c23.5,0 42.7,-19.2 42.7,-42.7v-256l-85.4,-85.4Zm-106.7,341.3c-35.4,0 -64,-28.6 -64,-64c0,-35.4 28.6,-64 64,-64c35.4,0 64,28.6 64,64c0,35.4 -28.6,64 -64,64Zm64,-213.3h-213.3v-85.3h213.3v85.3Z" fill="currentColor"></path></svg></span><div>`
        activeClass.insertAdjacentHTML('afterend', inputHTML);

        const newWrapper = els.querySelector('.brxc-clone-class-wrapper')
        const newInput = newWrapper.querySelector('#brxc-clone-class-input');
        if(!newInput) return;
        newInput.focus();
        newInput.setSelectionRange(newInput.value.length, newInput.value.length)

        self.autocomplete(newInput, self.globalClasses(), false);
        const saveBtn = document.querySelector('.brxc-clone-class-wrapper .bricks-svg-wrapper.create')

        function cloneClass(){
            // Create CSS Settings
            let settings 
            (typeof self.vueGlobalProp.$_state.activeClass !== "undefined" && self.vueGlobalProp.$_state.activeClass.hasOwnProperty('settings')) ? settings = self.vueGlobalProp.$_state.activeClass.settings : settings = {};
            let isUnique = true;
            let idClass;

            const addClass = (id, message, newWrapper) =>{
                // Add class to the element
                if (typeof self.vueGlobalProp.$_state.activeElement.settings !== "undefined" && self.vueGlobalProp.$_state.activeElement.settings.hasOwnProperty('_cssGlobalClasses')) {
                    if (!self.vueGlobalProp.$_state.activeElement.settings._cssGlobalClasses.includes(id)) self.vueGlobalProp.$_state.activeElement.settings._cssGlobalClasses.push(id)
                } else {
                    self.vueGlobalProp.$_state.activeElement.settings._cssGlobalClasses = [];
                    self.vueGlobalProp.$_state.activeElement.settings._cssGlobalClasses.push(id);
                }


                newWrapper.remove();
                self.vueGlobalProp.$_showMessage(message);
            }

            // Check if class exists
            self.vueGlobalProp.$_state.globalClasses.forEach(obj => {
                if (obj.name === newInput.value.replace(/\s+/g, '-')){
                    isUnique = false;
                    idClass = obj.id;
                } 
            })


            if(isUnique === false) {
                addClass(idClass, 'Aborted: the class already exists!', newWrapper)
                return;
            }

            // Generate unique ID
            idClass = self.vueGlobalProp.$_generateId()

            // Create the class object
            const newGlobalClass = {
                id: idClass,
                name: newInput.value.replace(/\s+/g, '-'),
                settings: settings
            };

            self.vueGlobalProp.$_state.globalClasses.push(newGlobalClass);
            addClass(idClass, 'Class Successfully Created!', newWrapper)
        }

        saveBtn.addEventListener("click", function(event) {
            cloneClass()
        });

        newInput.addEventListener('keyup', function(event) {
            if (event.shiftKey && event.keyCode === 13) cloneClass();
        });
    },
    exportIDStylestoClass: function(){
        const self = this;
        const els = document.querySelector('#bricks-panel-element-classes')
        if (!els) return;

        const wrapper = els.querySelector('.brxc-copy-id-to-class-wrapper')
        if(wrapper) return wrapper.remove();

        const activeClass = els.querySelector('.active-class');

        const inputHTML = `<div class="brxc-copy-id-to-class-wrapper"><input type="text" id="brxc-copy-id-to-class-input" size="999" autocomplete="off" spellcheck="false" placeholder="Type your class name here"><span class="bricks-svg-wrapper create" data-balloon="Create/Update (SHIFT + ENTER)" data-balloon-pos="left"><!--?xml version="1.0" encoding="UTF-8"?--><svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="bricks-svg"><path d="M362.7,64h-256c-23.7,0 -42.7,19.2 -42.7,42.7v298.7c0,23.5 19,42.7 42.7,42.7h298.7c23.5,0 42.7,-19.2 42.7,-42.7v-256l-85.4,-85.4Zm-106.7,341.3c-35.4,0 -64,-28.6 -64,-64c0,-35.4 28.6,-64 64,-64c35.4,0 64,28.6 64,64c0,35.4 -28.6,64 -64,64Zm64,-213.3h-213.3v-85.3h213.3v85.3Z" fill="currentColor"></path></svg></span><div>`
        activeClass.insertAdjacentHTML('afterend', inputHTML);

        const newWrapper = els.querySelector('.brxc-copy-id-to-class-wrapper')
        const newInput = newWrapper.querySelector('#brxc-copy-id-to-class-input');
        if(!newInput) return;
        newInput.focus();

        self.autocomplete(newInput, self.globalClasses(), false);
        const saveBtn = document.querySelector('.brxc-copy-id-to-class-wrapper .bricks-svg-wrapper.create');

        function exportSettings(){
            // Create CSS Settings
            const settings = {};
            for (const [key, value] of Object.entries(self.vueGlobalProp.$_state.activeElement.settings)){
                if( key === '_cssCustom'){
                    let id;
                    (typeof self.vueGlobalProp.$_state.activeElement.settings !== "undefined" && self.vueGlobalProp.$_state.activeElement.settings.hasOwnProperty('_cssId')) ? id = '#' + self.vueGlobalProp.$_state.activeElement.settings._cssId : id = '#brxe-' + self.vueGlobalProp.$_state.activeElement.id;
                    settings[key] = value.replace(id, '.' + newInput.value.replace(/\s+/g, '-'))
                } else if (self.helpers.isCSSControlKey(key)) {
                    settings[key] = value;
                }
            }
            let isLocked;
            let isUnique = true;
            let idClass;

            const addClass = (id, message, newWrapper) =>{
                // Add class to the element
                if (typeof self.vueGlobalProp.$_state.activeElement.settings !== "undefined" && self.vueGlobalProp.$_state.activeElement.settings.hasOwnProperty('_cssGlobalClasses')) {
                    if (!self.vueGlobalProp.$_state.activeElement.settings._cssGlobalClasses.includes(id)) self.vueGlobalProp.$_state.activeElement.settings._cssGlobalClasses.push(id)
                } else {
                    self.vueGlobalProp.$_state.activeElement.settings._cssGlobalClasses = [];
                    self.vueGlobalProp.$_state.activeElement.settings._cssGlobalClasses.push(id);
                }

                // Remove styles on ID
                for (const [key, value] of Object.entries(self.vueGlobalProp.$_state.activeElement.settings)){
                    if (self.helpers.isCSSControlKey(key)) delete self.vueGlobalProp.$_state.activeElement.settings[key];
                }

                newWrapper.remove();
                self.vueGlobalProp.$_showMessage(message);
            }

            // Check if class exists
            self.vueGlobalProp.$_state.globalClasses.forEach(obj => {
                if (obj.name === newInput.value.replace(/\s+/g, '-')){
                    isUnique = false;
                    idClass = obj.id;
                    isLocked = self.vueGlobalProp.$_isLocked(obj.id);
                    if (!isLocked) for (const [key, value] of Object.entries(settings)){
                        obj.settings[key] = value;
                    }
                } 
            })

            if(isLocked === true){
                newWrapper.remove();
                self.vueGlobalProp.$_showMessage('Abort: the class is locked');
                return;
            }

            if(isUnique === false) {
                addClass(idClass, 'Class Successfully Updated!', newWrapper)
                return;
            }

            // Generate unique ID
            idClass = self.vueGlobalProp.$_generateId()

            // Create the class object
            const newGlobalClass = {
                id: idClass,
                name: newInput.value.replace(/\s+/g, '-'),
                settings: settings
            };

            self.vueGlobalProp.$_state.globalClasses.push(newGlobalClass);
            addClass(idClass, 'Class Successfully Created!', newWrapper)
        }

        newInput.addEventListener('keyup', function(event) {
            if (event.shiftKey && event.keyCode === 13) exportSettings();
        });

        saveBtn.addEventListener('click', function(event) {
                exportSettings()
        });


        
    },
    importIDStylestoClass: function(){
        const self = this;

        // Create CSS Settings
        const settings = {};
        for (const [key, value] of Object.entries(self.vueGlobalProp.$_state.activeElement.settings)){
            // if (key != '_cssGlobalClasses' && key.charAt(0) === '_') {
            //     settings[key] = value;
            // }

            if( key === '_cssCustom'){
                let id;
                (typeof self.vueGlobalProp.$_state.activeElement.settings !== "undefined" && self.vueGlobalProp.$_state.activeElement.settings.hasOwnProperty('_cssId')) ? id = '#' + self.vueGlobalProp.$_state.activeElement.settings._cssId : id = '#brxe-' + self.vueGlobalProp.$_state.activeElement.id;
                settings[key] = value.replace(id, '.' + self.vueGlobalProp.$_activeClass._value.name);
            } else if (self.helpers.isCSSControlKey(key)) {
                settings[key] = value;
            }

            
        }

        const addClass = (message) =>{

            // Import Styles from ID
            for (const [key, value] of Object.entries(settings)){
                self.vueGlobalProp.$_activeClass._value.settings[key] = value;
                delete self.vueGlobalProp.$_state.activeElement.settings[key]
            }

            self.vueGlobalProp.$_showMessage(message);
        }

        addClass('Styles Successfully Imported to the Class!')



    },
    setVariableAutocomplete: function() {
        const self = this;
        setTimeout(() => {
            self.fields['CSSVariabe']['includedFields'].forEach(field => {
                let elements;
                if (typeof field === 'string') {
                    elements = Array.from(document.querySelectorAll(field));
                } else {
                    // Get elements with the selector
                    const filteredElements = Array.from(document.querySelectorAll(field.selector));
    
                    // Check if they have any of the specified child elements
                    elements = filteredElements.filter(el =>
                        field.hasChild.some(child => el.querySelector(child))
                    );
                }
    
                const wrappers = elements.filter(
                    item =>
                        !item.parentNode.closest(self.fields['CSSVariabe']['excludedFields']) &&
                        !item.classList.contains('autocomplete-active')
                );
                if (wrappers.length < 1) return;
                wrappers.forEach(wrapper => {
                    wrapper.classList.add('autocomplete-active');
                    const input = wrapper.querySelector("input[type='text']");
                    input.addEventListener('focus', () => {
                        self.autocomplete(input, self.cssVariables, "style");
                    });
                });
            });
        }, 100);
    },
    previousTab: '',
    setActiveStyleTabs: function(){
        const self = this;
        const currentPanelTab = self.vueGlobalProp.$_state.activePanelTab;
        if (currentPanelTab !== "style" || self.previousTab === currentPanelTab || self.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts === true) return self.previousTab = currentPanelTab;
        
        self.vueGlobalProp.$_state.activePanelGroup = '';
        self.previousTab = currentPanelTab;
    },
    setBorderAndBoxShadow: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        const x = document.querySelector('#bricks-builder-iframe').contentWindow;
        const els = x.document.querySelectorAll('.has-border-settings');
        if(els.length > 0) els.forEach(el => el.classList.remove('has-border-settings'))

        if(self.vueGlobalProp.$_state.activePanelGroup !== "_border") return;

        const activeElementID = '#brxe-' + self.vueGlobalProp.$_state.activeElement.id;
        const activeEl = x.document.querySelector(activeElementID);
        activeEl.classList.add('has-border-settings');
    },
    initToolbar: function(){
        const self = this;
        const leftToolbar = document.querySelector('#bricks-toolbar ul.group-wrapper.left');
        const rightToolbar = document.querySelector('#bricks-toolbar ul.group-wrapper.right');
        let elements;
        let structure;
        if (leftToolbar){
            elements = leftToolbar.querySelector('.elements');
        }
        if (rightToolbar){
            structure = rightToolbar.querySelector('.structure');
        }
        // Builder Tweaks - Global Features
        if (self.helpers.isBuilderTweaksTabActive('global-features') ){
            (Object.values(self.globalSettings.globalFeatures).includes('GridGuide')) ? self.addMenuItemtoToolbar('grid-guide', 'Grid Guides (ctrl+cmd+' + self.globalSettings.keyboardShortcuts.gridGuides + ')', 'bottom', 'ADMINBRXC.gridGuide(this)', '<i class="bricks-svg ti-layout-grid4-alt" style="opacity: .5;"></i>', leftToolbar,  elements) : '';
            (Object.values(self.globalSettings.globalFeatures).includes('X-Mode')) ? self.addMenuItemtoToolbar('x-mode', 'X-Mode (ctrl+cmd+' + self.globalSettings.keyboardShortcuts.xMode + ')', 'bottom', 'ADMINBRXC.XCode(this)', '<i class="bricks-svg fas fa-border-top-left" style="opacity: .5;"></i>', leftToolbar, elements) : '';
            (Object.values(self.globalSettings.globalFeatures).includes('ContrastChecker')) ? self.addMenuItemtoToolbar('constrast', 'Contrast Checker (ctrl+cmd+' + self.globalSettings.keyboardShortcuts.contrastChecker + ')', 'bottom', 'ADMINBRXC.contrast(this)', '<i class="bricks-svg ion-ios-contrast" style="opacity: .5;"></i>', leftToolbar, elements) : '';
            (Object.values(self.globalSettings.globalFeatures).includes('Darkmode')) ? self.addMenuItemtoToolbar('darkmode', 'Darkmode (ctrl+cmd+' + self.globalSettings.keyboardShortcuts.darkmode + ')', 'bottom', 'ADMINBRXC.darkMode(this)', '<i class="bricks-svg fas fa-moon" style="opacity: .5;"></i>', leftToolbar, elements) : '';
        }

        // Classes and Styles
        if (self.helpers.isClassesAndStylesTabActive('advanced-css') ){
            self.addMenuItemtoToolbar('custom-css', 'Advanced CSS (ctrl+cmd+' + self.globalSettings.keyboardShortcuts.cssStylesheets + ')', 'bottom', 'ADMINBRXC.openModal(false, "#brxcCSSOverlay");document.querySelector("#brxcCSSOverlay .CodeMirror").CodeMirror.setValue(document.querySelector(".brx-body").__vue_app__.config.globalProperties.$_state.pageSettings.customCss);', '<i class="bricks-svg fas fa-code" style="opacity: .5;"></i>', leftToolbar, elements);
        }

        // AI
        if (self.helpers.isAIActive() && self.globalSettings.isAIApiKeyEmpty === '0'){
            self.addMenuItemtoToolbar('openai', 'OpenAI Assistant (ctrl+cmd+' + self.globalSettings.keyboardShortcuts.openai + ')', 'bottom', 'ADMINBRXC.openModal(false, "#brxcGlobalOpenAIOverlay")', '<i class="bricks-svg fas fa-robot" style="opacity: .5;"></i>', rightToolbar, structure)
        }

        // Extras
        (self.helpers.isExtrasTabActive('resources')) ? self.addMenuItemtoToolbar('resources', 'Resources (ctrl+cmd+' + self.globalSettings.keyboardShortcuts.resources + ')', 'bottom', 'ADMINBRXC.openModal(false, "#brxcResourcesOverlay")', '<i class="bricks-svg fas fa-images" style="opacity: .5;"></i>', rightToolbar, structure) : '';
        (self.helpers.isExtrasTabActive('brickslabs')) ? self.addMenuItemtoToolbar('openai', 'BricksLabs (ctrl+cmd+' + self.globalSettings.keyboardShortcuts.brickslabs + ')', 'bottom', 'ADMINBRXC.bricksLabsAPI(false, false, true);ADMINBRXC.openModal(false, "#brxcBricksLabsOverlay")', '<i class="bricks-svg fas fa-flask" style="opacity: .5;"></i>', rightToolbar, structure) : '';
    },
    setColumnNumber: function(num){
        let style = document.querySelector('#brxcColumnNumber');
        if(!style){
            style = document.createElement("STYLE");
            style.setAttribute("id", "brxcColumnNumber");
            document.head.appendChild(style);
        }
        style.innerHTML = `#bricks-panel-elements #bricks-panel-elements-categories .sortable-wrapper {grid-template-columns: repeat(${num},1fr) !important;}`;
    },
    setElementsColumns: function(){
        const self = this;
        if (self.vueGlobalProp.$_state.activePanel != 'elements') return;
        const header = document.querySelector('#bricks-panel-inner #bricks-panel-elements #bricks-panel-header')
        const oldMenu = document.querySelector('#bricks-panel-view');
        if(oldMenu) return;

        const wrapper = document.createElement("UL");
        wrapper.setAttribute("id", "bricks-panel-view");
        header.after(wrapper);
        self.addIconToFields('li','brxc-header-icon brxc-header-icon__hover', false, '2-col', 'bottom-right', 'ADMINBRXC.setColumnNumber(2)', true, '<span class="bricks-svg-wrapper"><i class="ti-layout-column2-alt"></i></span>', wrapper, 'child');
        self.addIconToFields('li','brxc-header-icon brxc-header-icon__hover', false, '3-col', 'bottom-right', 'ADMINBRXC.setColumnNumber(3)', true, '<span class="bricks-svg-wrapper"><i class="ti-layout-column3-alt"></i></span>', wrapper, 'child');
        self.addIconToFields('li','brxc-header-icon brxc-header-icon__hover', false, '4-col', 'bottom-right', 'ADMINBRXC.setColumnNumber(4)', true, '<span class="bricks-svg-wrapper"><i class="ti-layout-column4-alt"></i></span>', wrapper, 'child');
    },
    highlightClasses: function(){
        const self = this;
        const x = document.querySelector('#bricks-builder-iframe').contentWindow;
        const structureItems = document.querySelectorAll('#bricks-structure .bricks-structure-list .bricks-draggable-item');
        if (!self.helpers.isClassActive()) {
            const activeEls = x.document.querySelectorAll('.brxc-active-class');
            if(activeEls.length < 1) return;
            activeEls.forEach(el => el.classList.remove('brxc-active-class'))
            // Structure Panel
            if(structureItems.length < 1) return;
            structureItems.forEach(el => {
                const structureItem = el.querySelector(':scope > .structure-item')
                structureItem.classList.remove('brxc-active-class')
            })
        } else {
            const els = x.document.querySelectorAll('.brxc-active-class');
            const activeEls = x.document.querySelectorAll('.' + self.vueGlobalProp.$_state.activeClass.name);
            if(els.length > 0) els.forEach(el => el.classList.remove('brxc-active-class'))
            if(activeEls.length < 1) return;
            activeEls.forEach(el => el.classList.add('brxc-active-class'));
            // Structure Panel
            if(structureItems.length < 1) return;
            const activeClassID = self.vueGlobalProp.$_state.activeClass.name;
            structureItems.forEach(el => {
                const structureItem = el.querySelector(':scope > .structure-item')
                structureItem.classList.remove('brxc-active-class')
                elID = el.dataset.id;
                if(self.vueGlobalProp.$_getElementGlobalClassNames(self.vueGlobalProp.$_getElementObject(elID).settings).includes(activeClassID)){
                    structureItem.classList.add('brxc-active-class');
                }
            })
        }
    },
    countClasses: function (){
        const self = this;

        const numClasses = document.querySelector('#bricks-panel #brxcNumClasses');
        if(numClasses) numClasses.remove()

        if (self.vueGlobalProp.$_state.activePanel !== "element" || !self.helpers.isClassActive()) return;
        
        const activeClasses = document.querySelector('#bricks-panel .active-class .symbol.counter');
        if(!activeClasses) return;

        const x = document.querySelector('#bricks-builder-iframe').contentWindow;
        const classes = x.document.querySelectorAll('.' + self.vueGlobalProp.$_state.activeClass.name);
        if(classes.length < 1) return;
        const numClassesHTML = `<span id="brxcNumClasses" class="symbol counter" data-balloon="Used class on page" data-balloon-pos="top-right">${classes.length}</span>`;
        activeClasses.insertAdjacentHTML('afterend', numClassesHTML);

        const icon = document.querySelector('#bricks-panel #brxcNumClasses');

        let i = 0;
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            classes[i].scrollIntoView({ behavior: "smooth"});
            (i === classes.length - 1) ? i = 0 : i++;
        })
    },
    panelSwitch: function(el){
        const self = this;
        if (el.dataset.panel) self.vueGlobalProp.$_state.activePanelTab = el.dataset.panel;
        if (el.dataset.panelGroup) self.vueGlobalProp.$_state.activePanelGroup = el.dataset.panelGroup;
        const els = document.querySelectorAll('#bricks-panel-element .brxce-panel-shortcut__container > li')
        els.forEach(el => el.classList.remove('active'));
        el.classList.add('active');
    },
    hideInactivePanels: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        const controlGroups = document.querySelector('.bricks-panel-controls ul.control-groups');
        if(!controlGroups) return;
        controlGroups.classList.remove('hidden-accordion-panels')
        const activeGroup = Array.from(controlGroups.querySelectorAll('.control-group')).filter(el => el.classList.contains('open'));
        if (activeGroup.length > 0 && self.vueGlobalProp.$_state.activePanelGroup !== "" && self.vueGlobalProp.$_state.activePanelTab === "style") controlGroups.classList.add('hidden-accordion-panels');

    },
    panelShortcuts: function(){
        const self = this;

        const panelElement = document.querySelector('#bricks-panel-element');
    
        if( !panelElement || self.vueGlobalProp.$_state.activePanel !== "element") return;
   
        panelElement.setAttribute("data-active", "true");

        let wrapper = panelElement.querySelector('.brxce-panel-shortcut__wrapper');
        if (wrapper) wrapper.remove();

        const panelHeader = panelElement.querySelector('#bricks-panel-header')
        if (!panelHeader) return;
        wrapper = `<div class="brxce-panel-shortcut__wrapper"><div class="brxce-panel-shortcut__container">`;
        (Object.values(self.globalSettings.shortcutsTabs).includes('content')) ? wrapper += `<li data-panel="content" data-balloon="Content" data-balloon-pos="right" onClick="ADMINBRXC.panelSwitch(this)"><span class="bricks-svg-wrapper"><i class="fas fa-pen"></i></span></li>` : '';
        if(Object.values(self.globalSettings.classFeatures).includes("disable-id-styles") && self.vueGlobalProp.$_state.brxc.showLock === true) {
            wrapper += `</div></div>`;
            panelHeader.insertAdjacentHTML('afterend', wrapper);
            const activePanel = panelElement.querySelector('[data-panel="content"]')
            activePanel.classList.add('active')
            return;
        }
        const controlGroups = bricksData.elements[self.vueGlobalProp.$_state.activeElement.name].controlGroups;
    
        (Object.values(self.globalSettings.shortcutsTabs).includes('layout') && typeof controlGroups !== "undefined" && controlGroups.hasOwnProperty('_layout')) ? wrapper += `<li data-panel="style" data-panel-group="_layout" data-balloon="Layout" data-balloon-pos="right" onClick="ADMINBRXC.panelSwitch(this)" onmouseenter="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = true" onmouseleave="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = false"><span class="bricks-svg-wrapper"><i class="fas fa-layer-group"></i></span></li>` : '';
        (Object.values(self.globalSettings.shortcutsTabs).includes('typography') && typeof controlGroups !== "undefined" && controlGroups.hasOwnProperty('_typography')) ? wrapper += `<li data-panel="style" data-panel-group="_typography" data-balloon="Typography" data-balloon-pos="right" onClick="ADMINBRXC.panelSwitch(this)" onmouseenter="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = true" onmouseleave="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = false"><span class="bricks-svg-wrapper"><i class="fas fa-font"></i></span></li>` : '';
        (Object.values(self.globalSettings.shortcutsTabs).includes('background') && typeof controlGroups !== "undefined" && controlGroups.hasOwnProperty('_background')) ? wrapper += `<li data-panel="style" data-panel-group="_background" data-balloon="Background" data-balloon-pos="right" onClick="ADMINBRXC.panelSwitch(this)" onmouseenter="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = true" onmouseleave="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = false" ><span class="bricks-svg-wrapper"><i class="fas fa-image"></i></span></li>` : '';
        (Object.values(self.globalSettings.shortcutsTabs).includes('borders') && typeof controlGroups !== "undefined" && controlGroups.hasOwnProperty('_border')) ? wrapper += `<li data-panel="style" data-panel-group="_border" data-balloon="Border / Box Shadow" data-balloon-pos="right" onClick="ADMINBRXC.panelSwitch(this)" onmouseenter="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = true" onmouseleave="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = false"><span class="bricks-svg-wrapper"><i class="fas fa-border-all"></i></span></li>` : '';
        (Object.values(self.globalSettings.shortcutsTabs).includes('gradient') && typeof controlGroups !== "undefined" && controlGroups.hasOwnProperty('_gradient')) ? wrapper += `<li data-panel="style" data-panel-group="_gradient" data-balloon="Gradient / Overlay" data-balloon-pos="right" onClick="ADMINBRXC.panelSwitch(this)" onmouseenter="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = true" onmouseleave="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = false"><span class="bricks-svg-wrapper"><i class="fas fa-brush"></i></span></li>` : '';
        (Object.values(self.globalSettings.shortcutsTabs).includes('shapes') && typeof controlGroups !== "undefined" && controlGroups.hasOwnProperty('_shapes')) ? wrapper += `<li data-panel="style" data-panel-group="_shapes" data-balloon="Shape Dividers" data-balloon-pos="right" onClick="ADMINBRXC.panelSwitch(this)" onmouseenter="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = true" onmouseleave="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = false"><span class="bricks-svg-wrapper"><i class="fas fa-shapes"></i></span></li>` : '';
        (Object.values(self.globalSettings.shortcutsTabs).includes('transform') && typeof controlGroups !== "undefined" && controlGroups.hasOwnProperty('_transform')) ? wrapper += `<li data-panel="style" data-panel-group="_transform" data-balloon="Transform" data-balloon-pos="right" onClick="ADMINBRXC.panelSwitch(this)" onmouseenter="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = true" onmouseleave="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = false"><span class="bricks-svg-wrapper"><i class="fas fa-wand-magic-sparkles"></i></span></li>` : '';
        (Object.values(self.globalSettings.shortcutsTabs).includes('css') && typeof controlGroups !== "undefined" && controlGroups.hasOwnProperty('_css')) ? wrapper += `<li data-panel="style" data-panel-group="_css" data-balloon="CSS" data-balloon-pos="right" onClick="ADMINBRXC.panelSwitch(this)"><span class="bricks-svg-wrapper" onmouseenter="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = true" onmouseleave="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = false"><i class="fab fa-css3-alt"></i></span></li>` : '';
        (Object.values(self.globalSettings.shortcutsTabs).includes('attributes') && typeof controlGroups !== "undefined" && controlGroups.hasOwnProperty('_attributes')) ? wrapper += `<li data-panel="style" data-panel-group="_attributes" data-balloon="Attributes" data-balloon-pos="right" onClick="ADMINBRXC.panelSwitch(this)" onmouseenter="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = true" onmouseleave="ADMINBRXC.vueGlobalProp.$_state.brxc.clickedOnLeftPanelShortcuts = false"><span class="bricks-svg-wrapper"><i class="fas fa-database"></i></span></li>` : '';
        wrapper += `</div></div>`;
        panelHeader.insertAdjacentHTML('afterend', wrapper);

        // Active state
        const li = panelElement.querySelectorAll('.brxce-panel-shortcut__container li')
        if(li.length > 0){
            li.forEach(el => el.classList.remove('active'));
            if (self.vueGlobalProp.$_state.activePanelTab === "content") {
                const active = Array.from(li).find(el => el.dataset.panel === "content");
                (active) ? active.classList.add('active') : '';
            } else if (self.vueGlobalProp.$_state.activePanelGroup) {
                const active = Array.from(li).find(el => el.dataset.panelGroup === self.vueGlobalProp.$_state.activePanelGroup);
                if(active){
                    active.classList.add('active');
                    active.addEventListener('click', () => {
                        self.vueGlobalProp.$_state.activePanelGroup = '';
                    })
                }
            }
        }
        
    },

    panelShortcutsActive: function(changeBreakpoint){
        //indicator
        //setTimeout(() => {
        function calculateActiveTabs(){
            const panel = document.querySelector('#bricks-panel-element');
            const indicators = panel.querySelectorAll('.bricks-panel-controls .control-group-title > .has-setting')
            if(indicators.length < 1) {
                const leftTabs = panel.querySelectorAll('.brxce-panel-shortcut__container li');
                if(leftTabs.length < 1) return;
                leftTabs.forEach(el => {
                    el.classList.remove('has-settings');
                })
                return;
            }
            const activeTabs = [];
            indicators.forEach(el => {
                activeTabs.push(el.nextElementSibling.textContent)
            })
            const leftTabs = panel.querySelectorAll('.brxce-panel-shortcut__container li');
            if(leftTabs.length < 1) return;
            leftTabs.forEach(el => {
                el.classList.remove('has-settings');
                if(activeTabs.includes(el.dataset.balloon) ) el.classList.add('has-settings');
            })
        }
            
        if(changeBreakpoint){
            setTimeout(() => {calculateActiveTabs()}, 100)
        } else {
            calculateActiveTabs()
        }
        
    },
    structureElementHasStyle: function(){
        const self = this;

        const structure = document.querySelector('#bricks-structure');

        const els = structure.querySelectorAll('#bricks-structure .panel-content .bricks-draggable-item.element')
        if (els.length < 1) return;

        const hasStyle = (obj) => {
            for (const key in obj) {
                if (self.helpers.isCSSControlKey(key)) {
                  return true;
                }
            }
            return false;
        }
        const hasClass = (obj) => {
            for (const key in obj) {
                
                if ((key === '_cssGlobalClasses' || key === '_cssClasses') && obj[key].length > 0) {
                  return true;
                }
            }
            return false;
        }
        els.forEach(el => {
            el.removeAttribute('data-has-styles');
            el.removeAttribute('data-has-classes');
            if(hasStyle(self.vueGlobalProp.$_getElementObject(el.dataset.id).settings)){
                el.setAttribute('data-has-styles', 'true');
            }
            if(hasClass(self.vueGlobalProp.$_getElementObject(el.dataset.id).settings)){
                el.setAttribute('data-has-classes', 'true');
            }
        })
    },
    mediaQueriesHasStyle: function(){
        const self = this;

        const breakpointWrapper = document.querySelector('#bricks-toolbar ul.group-wrapper.breakpoints');
        const breakpoints = breakpointWrapper.querySelectorAll('li[data-key]');
        if (breakpoints.length < 1) return;

        let settings;
        if(!self.helpers.isClassActive() && typeof self.vueGlobalProp.$_state.activeElement !== "undefined" && self.vueGlobalProp.$_state.activeElement.hasOwnProperty('settings')){
            settings = self.vueGlobalProp.$_state.activeElement.settings
        } else if(self.helpers.isClassActive() && self.vueGlobalProp.$_state.activeClass.settings) {
            settings = self.vueGlobalProp.$_state.activeClass.settings
        } else {
            return;
        }

        function checkSettings(settings){
            const result = [];
            let keyWithUnderscoreExists = false;

            for (const key in settings) {
                if (self.helpers.isCSSControlKey(key)) {
                keyWithUnderscoreExists = true;
                    if (!key.includes(":")) {
                        result.push('desktop')
                    } else {
                        const mediaQueryKey = key.split(":")[1];
                        result.push(mediaQueryKey);
                    }
                }
            }
            if (!keyWithUnderscoreExists) {
                return false;
            }
            return [...new Set(result)];
        }
        const activeBp = checkSettings(settings);
        breakpoints.forEach(bp => {
            bp.removeAttribute('data-styles')
            if (activeBp && activeBp.includes(bp.dataset.key)){
                bp.setAttribute('data-styles', "true")
            }
        })
    },
    setColorsforStructureIndicators: function (){
        const self = this;
        const color = self.globalSettings.structurePanelTagIndicatorColors;
        if(color){
            const structurePanel = document.querySelector('#bricks-structure');
            structurePanel.setAttribute('data-indicators-color', color);
        }

    },
    classIndicator: function() {
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;

        // Const

        const panel = document.querySelector("#bricks-panel-element");
        const els = panel.querySelectorAll("[data-controlkey^='_']");

        // Functions
        function getClassKeysFromGlobalSettings(classesIds) {
            let classesKeys = [];
            
            classesIds.forEach((id) => {
                const globalClass = self.vueGlobalProp.$_getGlobalClass(id);
    
                if (typeof globalClass !== "undefined" && globalClass.hasOwnProperty("settings")) {
                    const settings = globalClass.settings;
    
                    for (const key in settings) {
                        if (key.startsWith("_")) classesKeys.push(key);
                    }
                }
            });
            
            return [...new Set(classesKeys)];
        }
    

        
        const activeElement = self.vueGlobalProp.$_state.activeElement;
        const state = self.vueGlobalProp.$_state;
    
        if (typeof activeElement == "undefined" ||
            !activeElement.hasOwnProperty("settings") ||
            !activeElement.settings.hasOwnProperty("_cssGlobalClasses") ||
            (state.activeClass !== "" && 
            typeof state.activeClass !== "undefined" &&
            state.activeClass.hasOwnProperty("settings"))
        ) {
            els.forEach((el) => el.removeAttribute("data-has-class-style"));
            return
        }
    
        const finalKeys = getClassKeysFromGlobalSettings(activeElement.settings._cssGlobalClasses);
        
        els.forEach((el) => {
            let key = el.dataset.controlkey;
            
            if (state.breakpointActive !== "desktop") {
                key += `:${state.breakpointActive}`;
            }
    
            if (state.pseudoClassActive !== "") {
                key += state.pseudoClassActive;
            }
    
            if (finalKeys.includes(key)) {
                el.dataset.hasClassStyle = "true";
            } else {
                el.removeAttribute("data-has-class-style");
            }
        });
    },
    breakpointIndicator: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;

        // Const
        const panel = document.querySelector("#bricks-panel-element");
        const groups = panel.querySelectorAll('.control-group');

        if(self.vueGlobalProp.$_state.brxc.breakpointActive) {
            self.vueGlobalProp.$_state.breakpointActive = self.vueGlobalProp.$_state.brxc.breakpointActive;
        }


        // Render
        if (groups.length < 1) return;
        groups.forEach((group,index) => {
            self.vueGlobalProp.$_state.breakpoints.forEach(bp => {
                const icon = group.querySelector(`.brxc-group-icon[data-device="${bp.key}"]`);
                if(icon) icon.remove();
                if(self.vueGlobalProp.$_state.brxc.groupBreakPointsValues[index].includes(bp.key)){
                    let svg = '<span class="bricks-svg-wrapper"><svg version="1.1" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="bricks-svg"><path d="M27.744,2.5h-25.488c-0.968,0 -1.756,0.788 -1.756,1.755v17.489c0,0.968 0.788,1.755 1.756,1.755h12.244v3h-5.5c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5h12c0.276,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5h-5.5v-3h12.244c0.968,0 1.756,-0.788 1.756,-1.755v-17.489c0,-0.967 -0.788,-1.755 -1.756,-1.755Zm-1.244,18h-23v-15h23v15Z" fill="currentColor"></path></svg></span>';
                    if( bp.icon === "laptop") {
                        svg = '<span class="bricks-svg-wrapper"><svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="bricks-svg"><path d="M80.14,400c-17.7503,0 -32.14,-14.3897 -32.14,-32.14v-239.72c0,-17.7503 14.3897,-32.14 32.14,-32.14h351.72c17.7503,0 32.14,14.3897 32.14,32.14v239.72c0,17.7503 -14.3897,32.14 -32.14,32.14Z" stroke-width="32" stroke="currentColor" fill="none" stroke-linejoin="round"></path><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-width="32" d="M16,416h480"></path></svg></span>';
                    }
                    if( bp.icon === "tablet-landscape") {
                        svg = '<span class="bricks-svg-wrapper"><svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="bricks-svg"><g transform="matrix(1,0,0,1,0,512)"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M128,496c-26.5094,0 -48,-21.4906 -48,-48v-384c0,-26.5094 21.4906,-48 48,-48h256c26.5094,0 48,21.4906 48,48v384c0,26.5094 -21.4906,48 -48,48Z" transform="matrix(6.12323e-17,-1,1,6.12323e-17,0,0)"></path></g></svg></span>';
                    }
                    if( bp.icon === "tablet-portrait") {
                        svg = '<span class="bricks-svg-wrapper"><svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="bricks-svg"><path d="M128,496c-26.5094,0 -48,-21.4906 -48,-48v-384c0,-26.5094 21.4906,-48 48,-48h256c26.5094,0 48,21.4906 48,48v384c0,26.5094 -21.4906,48 -48,48Z" stroke-linecap="round" stroke-width="32" stroke="currentColor" fill="none" stroke-linejoin="round"></path></svg></span>';
                    }
                    if( bp.icon === "phone-landscape") {
                        svg = '<span class="bricks-svg-wrapper"><svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="bricks-svg"><g transform="matrix(1,0,0,1,0,512)"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M176,496c-26.5094,0 -48,-21.4906 -48,-48v-384c0,-26.5094 21.4906,-48 48,-48h160c26.5094,0 48,21.4906 48,48v384c0,26.5094 -21.4906,48 -48,48Z" transform="matrix(6.12323e-17,-1,1,6.12323e-17,0,0)"></path></g><path d="M16,336v-24l9.23706e-14,1.20797e-06c-6.67141e-07,-4.41828 3.58172,-8 8,-8v0h-6.99382e-07c8.83656,3.86258e-07 16,-7.16344 16,-16v-64v0c0,-8.83656 -7.16344,-16 -16,-16v0h-3.49691e-07c-4.41828,-1.93129e-07 -8,-3.58172 -8,-8c0,0 0,-2.84217e-14 0,-2.84217e-14v-24" stroke-linecap="round" stroke-width="32" stroke="currentColor" fill="none" stroke-linejoin="round"></path></svg></span>';
                    }
                    if( bp.icon === "phone-portrait") {
                        svg = '<span class="bricks-svg-wrapper"><svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="bricks-svg"><g stroke-linecap="round" stroke-width="32" stroke="currentColor" fill="none" stroke-linejoin="round"><path d="M176,496c-26.5094,0 -48,-21.4906 -48,-48v-384c0,-26.5094 21.4906,-48 48,-48h160c26.5094,0 48,21.4906 48,48v384c0,26.5094 -21.4906,48 -48,48Z"></path><path d="M176,16h24l-3.49691e-07,7.10543e-15c4.41828,-1.93129e-07 8,3.58172 8,8v0l1.7053e-13,2.41593e-06c1.33428e-06,8.83656 7.16345,16 16,16h64l-6.99382e-07,-1.42109e-14c8.83656,3.86258e-07 16,-7.16344 16,-16v0l1.13687e-13,1.20797e-06c-6.67141e-07,-4.41828 3.58172,-8 8,-8h24"></path></g></svg></span>';
                    }
                    let newClass = 'brxc-group-icon';
                    if(self.vueGlobalProp.$_state.breakpointActive === bp.key) newClass = 'brxc-group-icon active';
                    self.addIconToFields('li', newClass, [['data-device', bp.key]] , bp.label, 'top', false, true, svg, group.querySelector('.control-group-title'), 'child');
                }
            })
 
        })
        

        const groupIcons = panel.querySelectorAll('.brxc-group-icon');
        if(groupIcons.length < 1 ) return;
        groupIcons.forEach(el => {
            //activeState(el);
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const parentGroup = e.target.closest('li.control-group');
                if(parentGroup.classList.contains('open')) e.stopPropagation();
                el.remove();
            })
            el.addEventListener('mouseenter', (e) => {
                self.vueGlobalProp.$_state.brxc.breakpointActive = el.dataset.device;
            })
            el.addEventListener('mouseleave', (e) => {
                self.vueGlobalProp.$_state.brxc.breakpointActive = false;
            })
        })

        // End of render
    },
    setBreakpontIndicatorStatus: function(value){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;

        // Const
        const panel = document.querySelector("#bricks-panel-element");
        if(!panel) return;
        const groupIcons = panel.querySelectorAll('.brxc-group-icon');
        if (groupIcons.length < 1) return;
        groupIcons.forEach(el => {
            el.classList.remove('active');
            if(value && el.dataset.device && value === el.dataset.device) el.classList.add('active');
        })
    },
    lockedClassIndicator: function(){
        const self = this;
        if(self.vueGlobalProp.$_state.activePanel !== "element") return;
        const classes = document.querySelectorAll('#bricks-panel-element #bricks-panel-element-classes .element-classes li');
        if (classes.length < 1) return;
        classes.forEach(el => {
            el.removeAttribute("data-locked");
            const name = el.querySelector('.name')
            const id = name.dataset.classId;
            if (self.vueGlobalProp.$_isLocked(id)) el.setAttribute("data-locked", "true");
        })
    },
    lastElementFocus : '',
    focusOnFirstClass: function(){
        // const self = this;
        // if(self.vueGlobalProp.$_state.activePanel !== "element" || self.lastElementFocus === self.vueGlobalProp.$_state.activeElement.id) {
        //     delete self.vueGlobalProp.$_activeClass._value;
        //     self.vueGlobalProp.$_activeClass = ''
        //     return
        // }
        // if(self.vueGlobalProp.$_state.activeElement.hasOwnProperty('settings') && self.vueGlobalProp.$_state.activeElement.settings.hasOwnProperty('_cssGlobalClasses')){
        //     const el = self.vueGlobalProp.$_state.activeElement.settings._cssGlobalClasses[0];
        //     obj = Array.from(self.vueGlobalProp.$_state.globalClasses).find(item => item.id === el)

        //     self.vueGlobalProp.$_state.brxc.showLock = false;
        //     self.vueGlobalProp.$_activeClass = self.vueGlobalProp.$_clone(obj);
        //     self.vueGlobalProp.$_activeClass._value = self.vueGlobalProp.$_clone(obj);
        //     self.lastElementFocus = self.vueGlobalProp.$_state.activeElement.id;
        // }
    },
    setTagInStructurePanel: function(id,tag){
        const self = this;
        const obj = self.vueGlobalProp.$_getElementObject(id);
        if(typeof obj !== "undefined" && !obj.hasOwnProperty('settings')) obj.settings = {};
        obj.settings.tag = tag;
        setTimeout(() => self.showTagInStructurePanel(), 0);
    },
    
    showTagInStructurePanel: function(){
        const self = this;
        const structurePanel = document.querySelector('#bricks-structure');
        if(!structurePanel) return;
        const els = structurePanel.querySelectorAll('#bricks-structure main .bricks-draggable-item');
        if (els.length < 1) return;
        if(self.vueGlobalProp.$_state.brxc.tagsView === 'none') {
            els.forEach(el => {
                const wrapper = el.querySelector('.brxc-tag-btn-wrapper');
                if (wrapper) wrapper.remove();
            })
            structurePanel.removeAttribute('data-tag-color');
            return;
        }

        function createBtn(sibling, tag, options, obj){
            const wrapper = document.createElement('div');;
            wrapper.setAttribute("class", "brxc-tag-btn-wrapper");
            const btn = document.createElement('button')
            btn.setAttribute('class', 'brxc-tag-btn')
            if (options === false) {
                btn.classList.add('red');
            } else if (typeof options !== "object") {
                btn.classList.add('orange');
            }
            btn.setAttribute('onClick', 'ADMINBRXC.toggleTagDropdown(event)');
            btn.setAttribute('onmouseenter', `ADMINBRXC.vueGlobalProp.$_state.brxc.tagDropdownActive = true`)
            btn.setAttribute('onmouseleave', `ADMINBRXC.vueGlobalProp.$_state.brxc.tagDropdownActive = false`)
            btn.textContent = tag
            wrapper.appendChild(btn);

            ul = document.createElement("ul");
            ul.setAttribute('class', 'dropdown')
            if (options !== false && typeof options === "object") {
                options = Object.entries(options)
                for(const [key,value] in options){
                    const li = document.createElement('li');
                    li.setAttribute('class', 'hover');
                    li.setAttribute('data-id', obj);
                    li.setAttribute('onClick', `ADMINBRXC.setTagInStructurePanel(this.dataset.id, '${options[key][0]}')`)
                    li.textContent = options[key][0];
                    ul.appendChild(li)
                }
            }
            wrapper.appendChild(ul);
   
            sibling.after(wrapper);
        }

        els.forEach(el => {
            const oldBtn = el.querySelector('.brxc-tag-btn-wrapper');
            if(oldBtn) oldBtn.remove();
            const obj = self.vueGlobalProp.$_getElementObject(el.dataset.id);
            let tag;
            (typeof obj !== "undefined" && obj.hasOwnProperty('settings') && obj.settings.hasOwnProperty('tag')) ? tag = obj.settings.tag : tag = bricksData.elements[obj.name].tag
            const title = el.querySelector('.title .icon')
            let options;
            (typeof bricksData.elements[obj.name].controls !== "undefined" && bricksData.elements[obj.name].controls.hasOwnProperty('tag')) ? options = bricksData.elements[obj.name].controls.tag.options : options = false;
            createBtn(title, tag, options, el.dataset.id);
        })

        if(self.vueGlobalProp.$_state.brxc.tagsView === 'developer'){
            structurePanel.setAttribute('data-tag-color', 'true');
            self.vueGlobalProp.$_state.brxc.tagdropDownVisible = true;
        }

        if(self.vueGlobalProp.$_state.activeElement && self.vueGlobalProp.$_state.brxc.tagDropdownActive){
            const currentID = self.vueGlobalProp.$_state.activeElement.id;
            const btnWrapper = Array.from(els).filter(el => el.dataset.id === currentID);
            const dropdown = btnWrapper[0].querySelector('ul.dropdown');
            (dropdown) ? dropdown.classList.add('active') : '';
            self.vueGlobalProp.$_state.brxc.tagDropdownActive = false;
        }
        
    },
    toggleTagDropdown: function(event){
        const dropdown = event.target.nextElementSibling;
        (dropdown.classList.contains('active')) ? dropdown.classList.remove('active') : dropdown.classList.add('active');
    },
    highlightNestableElements: function(){
        const self = this;
        const structurePanel = document.querySelector('#bricks-structure');
        if(!structurePanel) return;
        const els = structurePanel.querySelectorAll('#bricks-structure main .bricks-draggable-item');
        if (els.length < 1) return;
        els.forEach(el => {
            el.removeAttribute('data-nestable');
            if (self.nestableElements.includes(self.vueGlobalProp.$_getElementObject(el.dataset.id).name)) el.setAttribute('data-nestable', 'true');
        })

    },
    highlightParentElements: function(){
        const self = this;
        const structurePanel = document.querySelector('#bricks-structure');
        if(!structurePanel || typeof self.vueGlobalProp.$_state.activeElement == "undefined") return;
        const els = structurePanel.querySelectorAll('#bricks-structure main .bricks-draggable-item');
        if (els.length < 1) return;
        const parents = []
        function populateParent(child){
            if (self.vueGlobalProp.$_getElementObject(child).parent === 0) return;
            parents.push(self.vueGlobalProp.$_getElementObject(child).parent);
            populateParent(self.vueGlobalProp.$_getElementObject(child).parent);
        }
        populateParent(self.vueGlobalProp.$_state.activeElement.id);
        els.forEach(el => {
            el.removeAttribute("data-parent");
            if(parents.includes(el.dataset.id)) el.setAttribute("data-parent", true);
        })
    },
    setBrxcStates: function(){
        const self = this;
        
        // States

        

        // Const

        const panel = document.querySelector("#bricks-panel-element");
        const groups = panel.querySelectorAll('.control-group');

        // Listeners
        self.vueGlobalProp.$_state.brxc['listeners'] = [];
        // Group Device breakpoint

        function intersect(a, b) {
            var setB = new Set(b);
            return [...new Set(a)].filter(x => setB.has(JSON.parse(JSON.stringify(x.split(":")[0]))));
        }

        function checkSettings(settings, groupKeys){
            const result = [];
            let keyWithUnderscoreExists = false;
            const filteredArray = intersect(settings, groupKeys);
            filteredArray.forEach(key => {
                if (self.helpers.isCSSControlKey(key)) {
                    keyWithUnderscoreExists = true;
                    if (!key.includes(":")) {
                        result.push('desktop')
                    } else {
                        const mediaQueryKey = key.split(":")[1];
                        result.push(mediaQueryKey);
                    }
                }
            })

            if (!keyWithUnderscoreExists) {
                return false;
            }
            return [...new Set(result)];       
        }

        const settings = [];
        if(!self.helpers.isClassActive() && typeof self.vueGlobalProp.$_state.activeElement !== "undefined" && self.vueGlobalProp.$_state.activeElement.hasOwnProperty('settings')){
            for(const key in self.vueGlobalProp.$_state.activeElement.settings){
                settings.push(key);
            }
        } else if(self.helpers.isClassActive() && self.vueGlobalProp.$_state.activeClass.settings) {
            for(const key in self.vueGlobalProp.$_state.activeClass.settings){
                settings.push(key);
            }
        }
        self.vueGlobalProp.$_state.brxc['groupBreakPointsValues'] = [];

        if(groups.length > 0) {
            groups.forEach((group,index) => {
                self.vueGlobalProp.$_state.brxc['groupBreakPointsValues'][index] = [];
                let keys = [];
                const items = group.querySelectorAll("[data-controlkey^='_']");
                if(items.length > 0){
                    items.forEach(item =>{
                        const key = item.dataset.controlkey;
                        keys.push(key);
                    })
                }
                const finalBreakpoints = checkSettings(settings, keys);
    
                self.vueGlobalProp.$_state.breakpoints.forEach(bp => {
                    if (finalBreakpoints && finalBreakpoints.length > 0 && finalBreakpoints.includes(bp.key)){
                        self.vueGlobalProp.$_state.brxc['groupBreakPointsValues'][index].push(bp.key);
                    } 
                })
            })
        }

        // Disable ID Style

        // End of States
    },
    runObserver: function() {
        const self = this;
        const panelInner = document.querySelector('#bricks-panel-inner');
        if (!panelInner) return;

        const observer = new MutationObserver(function(mutations) {
            //console.log(self.vueGlobalProp.$_state.breakpointActive);
            if(self.vueGlobalProp.$_state.brxcRunningObserver === true) return;
            self.vueGlobalProp.$_state.brxcRunningObserver = true;

            self.setBrxcStates();

            // Structure Panel
            if (self.helpers.isBuilderTweaksTabActive('structure-panel') ){
                (Object.values(self.globalSettings.structurePanelIcons).includes("tags")) ? self.showTagInStructurePanel() : '';
                (Object.values(self.globalSettings.structurePanelGeneralTweaks).includes("styles-and-classes-indicators")) ? self.structureElementHasStyle() : '';
                (Object.values(self.globalSettings.structurePanelGeneralTweaks).includes("highlight-nestable-elements")) ? self.highlightNestableElements() : '';
                (Object.values(self.globalSettings.structurePanelGeneralTweaks).includes("highlight-parent-elements")) ? self.highlightParentElements() :parent}

            // Classes
            if (self.helpers.isBuilderTweaksTabActive('classes-and-styles') ){
                (Object.values(self.globalSettings.classFeatures).includes("variable-picker")) ? self.addDynamicVariableIcon() : '';
                (Object.values(self.globalSettings.classFeatures).includes("color-preview")) ? self.setDynamicColorOnHover() : '';
                //self.focusOnFirstClass();
                (Object.values(self.globalSettings.classFeatures).includes("disable-id-styles")) ? self.forceClassStlyes() : '';
                (Object.values(self.globalSettings.classFeatures).includes("plain-classes")) ? self.setPlainClasses() : '';
                if (Object.values(self.globalSettings.classFeatures).includes("export-styles-to-class")) {
                    self.setexportIDStylestoClass();
                    self.setImportIDStylestoClass();
                }
                (Object.values(self.globalSettings.classFeatures).includes("clone-class")) ? self.setCloneClass() : '';
                (Object.values(self.globalSettings.classFeatures).includes("copy-class-to-clipboard")) ? self.setCopyClassToClipboard() : '';
                (Object.values(self.globalSettings.classFeatures).includes("highlight-classes")) ? self.highlightClasses() : '';
                (Object.values(self.globalSettings.classFeatures).includes("count-classes")) ? self.countClasses() : '';
                (Object.values(self.globalSettings.classFeatures).includes("extend-classes")) ? self.setExtendClass() : '';
                //self.setFilterActiveSettings();
                (Object.values(self.globalSettings.classFeatures).includes("find-and-replace")) ? self.setFindReplace() : '';
                (Object.values(self.globalSettings.classFeatures).includes("autocomplete-variable")) ? self.setVariableAutocomplete() : '';
                if (Object.values(self.globalSettings.classFeatures).includes("media-query-indicator")) {
                     self.setBreakpointsAttributes();
                     self.mediaQueriesHasStyle();
                }
                (Object.values(self.globalSettings.classFeatures).includes("class-indicator")) ? self.classIndicator() : '';
                (Object.values(self.globalSettings.classFeatures).includes("breakpoint-indicator")) ? self.breakpointIndicator() : '';
                (Object.values(self.globalSettings.classFeatures).includes("locked-class-indicator")) ? self.lockedClassIndicator() : '';
            }

            // Elements
            if (self.helpers.isBuilderTweaksTabActive('elements') ){
                self.setTextShortcutsWrapper();
                (Object.values(self.globalSettings.elementFeatures).includes("pseudo-shortcut") && self.globalSettings.shortcutsIcons.length > 0) ? self.addPanelHeaderIcons() : '';
                (Object.values(self.globalSettings.elementFeatures).includes("pseudo-shortcut") && self.globalSettings.shortcutsIcons.length > 0) ? self.headerIconsState() : '';
                (Object.values(self.globalSettings.elementFeatures).includes("parent-shortcut")) ? self.setGoToParentElement() : '';
                (Object.values(self.globalSettings.elementFeatures).includes("close-accordion-tabs")) ? self.setActiveStyleTabs() : '';
                (Object.values(self.globalSettings.elementFeatures).includes("disable-borders-boxshadows")) ? self.setBorderAndBoxShadow(): '';
                (Object.values(self.globalSettings.elementFeatures).includes("resize-elements-icons")) ? self.setElementsColumns() : '';
                (Object.values(self.globalSettings.elementFeatures).includes("lorem-ipsum")) ? self.addDynamicLoremIcon() : '';
                if (Object.values(self.globalSettings.elementFeatures).includes("tabs-shortcuts") && self.globalSettings.shortcutsTabs.length > 0) {
                    self.panelShortcuts();
                    self.panelShortcutsActive(false);
                }
                (Object.values(self.globalSettings.elementFeatures).includes("hide-inactive-accordion-panel")) ? self.hideInactivePanels() : '';
            }

            // AI
            (self.helpers.isAIActive() && self.globalSettings.isAIApiKeyEmpty === "0") ? self.addDynamicAIIcon() : ''; 

            setTimeout(() => self.vueGlobalProp.$_state.brxcRunningObserver = false, 100)
        });

        observer.observe(panelInner, { subtree: true, childList: true });
    },
    runObserverClasses: function() {
        const self = this;

        const panelInner = document.querySelector('#bricks-panel-inner:not(div.bricks-control-popup *)');
        if (!panelInner) return;

        const observer = new MutationObserver(function(mutations) {
            self.setDynamicClassOnHover();
        });
        observer.observe(panelInner, { 
            subtree: true, 
            childList: true,
            attributes: true,
            attributeFilter: ['class'],
        });
    },
    initObservers: function(){
        const self = this;
        // Main Observer
        self.runObserver();
        // Class Observer
        (self.helpers.isBuilderTweaksTabActive('classes-and-styles') && Object.values(self.globalSettings.classFeatures).includes("class-preview")) ? self.runObserverClasses() : "";
    },
    setKeyboardShortcuts: function(){
        const self = this;
        const x = document.querySelector('#bricks-builder-iframe').contentWindow;
        document.addEventListener('keydown', function(e) {
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.gridGuides && Object.values(self.globalSettings.globalFeatures).includes('GridGuide')) ? self.gridGuide(document.querySelector('#bricks-toolbar li.grid-guide')) : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.xMode && Object.values(self.globalSettings.globalFeatures).includes('X-Mode')) ? self.XCode(document.querySelector('#bricks-toolbar li.x-mode')) : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.contrastChecker && Object.values(self.globalSettings.globalFeatures).includes('ContrastChecker')) ? self.contrast(document.querySelector('#bricks-toolbar li.constrast')) : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.darkmode && Object.values(self.globalSettings.globalFeatures).includes('Darkmode')) ? self.darkMode(document.querySelector('#bricks-toolbar li.darkmode')) : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.cssStylesheets && Object.values(self.globalSettings.generalCats.classesAndStyles).includes('advanced-css')) ? self.openModal(false, "#brxcCSSOverlay") : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.resources && Object.values(self.globalSettings.generalCats.extras).includes('resources')) ? self.openModal(false, "#brxcResourcesOverlay") : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.openai && self.helpers.isAIActive()) ? self.openModal(false, "#brxcGlobalOpenAIOverlay") : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.brickslabs && Object.values(self.globalSettings.generalCats.extras).includes('brickslabs')) ? self.openModal(false, "#brxcBricksLabsOverlay") : '';
        });
        x.document.addEventListener('keydown', function(e) {
            (e.metaKey && e.ctrlKey && !e.repeat && e.key === self.globalSettings.keyboardShortcuts.gridGuides && Object.values(self.globalSettings.globalFeatures).includes('GridGuide')) ? self.gridGuide(document.querySelector('#bricks-toolbar li.grid-guide')) : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.xMode && Object.values(self.globalSettings.globalFeatures).includes('X-Mode')) ? self.XCode(document.querySelector('#bricks-toolbar li.x-mode')) : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.contrastChecker && Object.values(self.globalSettings.globalFeatures).includes('ContrastChecker')) ? self.contrast(document.querySelector('#bricks-toolbar li.constrast')) : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.darkmode && Object.values(self.globalSettings.globalFeatures).includes('Darkmode')) ? self.darkMode(document.querySelector('#bricks-toolbar li.darkmode')) : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.cssStylesheets && Object.values(self.globalSettings.generalCats.classesAndStyles).includes('advanced-css')) ? self.openModal(false, "#brxcCSSOverlay") : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.resources && Object.values(self.globalSettings.generalCats.extras).includes('resources')) ? self.openModal(false, "#brxcResourcesOverlay") : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.openai && self.helpers.isAIActive()) ? self.openModal(false, "#brxcGlobalOpenAIOverlay") : '';
            (e.metaKey && e.ctrlKey && e.key === self.globalSettings.keyboardShortcuts.brickslabs && Object.values(self.globalSettings.generalCats.extras).includes('brickslabs')) ? self.openModal(false, "#brxcBricksLabsOverlay") : '';
        });
    },
    setDefaultPseudoClasses: function(){
        const self = this;
        const pseudoList = self.vueGlobalProp.$_state.pseudoClasses;
        const defaultPseudo = [':before',':after',':hover', ':active', ':focus'];
        defaultPseudo.forEach(pseudo => {
            if (Object.values(pseudoList).indexOf(pseudo) > -1) return;
            self.vueGlobalProp.$_state.pseudoClasses.push(pseudo);
        })
    },
    colorConverter: function(obj){
        const self = this;
        const colors = [];
        function getColors(object){
            if(typeof object === "object"){
                for(const [key,value] of Object.entries(object)){
                    if(key === "hex" || key === "rgb" || key === "hsl" || key === "raw"){
                        colors.push(value);
                    } else {
                        getColors(value); 
                    }
                }
            } else if(Array.isArray(object)){
                object.forEach(el => getColors(el))
            }
        }
        getColors(obj)
        const finalColors = [... new Set(colors)].sort();
        console.log(finalColors);
        
    },
    findAndReplace: function(searchValue, replaceValue, property, element, position){
        const self = this;
        property = property.options[property.selectedIndex].value;
        element = element.options[element.selectedIndex].value;
        let content = self.vueGlobalProp.$_state.content;
        let numChanges = 0;
        

        function replaceHexWithColor(obj, color) {
            let hexFound = false;
        
            if (Array.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    const result = replaceHexWithColor(obj[i], color);
                    if (result.found) {
                        obj[i] = result.newValue;
                        hexFound = true;
                    }
                }
            } else if (typeof obj === "object" && obj !== null) {
                for (const key of Object.keys(obj)) {
                    const result = replaceHexWithColor(obj[key], color);
                    if (result.found) {
                        obj[key] = result.newValue;
                        hexFound = true;
                    }
                }
        
                if (obj.hasOwnProperty("hex") && obj.hex === searchValue) {
                    obj = color;
                    hexFound = true;
                    numChanges++;
                }
            }
        
            return { found: hexFound, newValue: obj };
        }

        function replaceColor(replaceColor){
            const palettes = self.vueGlobalProp.$_state.colorPalette;
            let matchingColor = false;
            palettes.forEach(palette => {
                palette.colors.forEach( color => {
                    for (const [key, value] of Object.entries(color)) {
                        if (color[key] === replaceColor)  {
                            matchingColor = color;
                        }
                    }
                })
            })
            return matchingColor;
        }
        function replaceStyle(id){
            const color = replaceColor(replaceValue)
            for(let i = 0; i < content.length; i++){
                for (const [key, value] of Object.entries(content[i])) {
                    if (key === 'id' && value === id ) {
                        for (const [key, value] of Object.entries(content[i].settings)) {
                            if(!self.helpers.isCSSControlKey(key)) continue ;

                            if(property === "all" || key === property) {
                                // colors
                                if(color){
                                    const checkColor = replaceHexWithColor(content[i].settings, color);
                                } else {
                                    // other
                                    const oldValue = content[i].settings[key];
                                    content[i].settings[key] = JSON.parse(JSON.stringify(value).replace(searchValue, replaceValue));

                                    if (JSON.stringify(oldValue) != JSON.stringify(content[i].settings[key])) numChanges++;
                                }

                            }
                        }
                    }
                }
            }
        }

        function setStyle(obj, id) {
            // Category check
            if(element === "all" || obj.name === element){
                replaceStyle(id);
            }
            if(Object.keys(obj.children).length > 0){
                Object.keys(obj.children).forEach(function (key){
                    const newObj = self.vueGlobalProp.$_getElementObject(obj.children[key]);
                    setStyle(newObj, obj.children[key]);
                });
            }
        }

        // page

        if(position === "page"){
            content.forEach(child => {
                if(element === "all" || child.name === element){
                    replaceStyle(child.id)
                } 
            })
        } else {
        
            // active element
            const el = self.vueGlobalProp.$_state.activeElement;
            const parentID = el.parent;
            if(!parentID || typeof content == "undefined") return;

            function checkParent(elemID){
                let obj;
                if(elemID !== false) obj = self.vueGlobalProp.$_getElementObject(elemID);
                
                // sibling
                
                if(position === "siblings"){
                    obj.children.forEach(child => {
                        const obj = self.vueGlobalProp.$_getElementObject(child);
                        if(element === "all" || obj.name === element){
                            replaceStyle(child);
                        }
                    })
                
                // children

                } else if(position === "children"){
                    obj = self.vueGlobalProp.$_activeElement._value;
                    if (typeof obj === "undefined" || !obj.hasOwnProperty('children') || obj.children.length < 1) return;
                    obj.children.forEach(child => {
                        const obj = self.vueGlobalProp.$_getElementObject(child)
                        setStyle(obj, child)
                    })

                // page

                } else if(position === "page"){
                    content.forEach(child => {
                        if(category === "all" || child.name === category){
                            replaceStyle(child.id);
                        }
                    })

                // custom postion
                } else {
                    if (obj.name === position){
                        obj.children.forEach(child => {
                            const obj = self.vueGlobalProp.$_getElementObject(child)
                            setStyle(obj, child)
                        })
                    } else {
                        if(obj.parent) checkParent(obj.parent);
                    }
                }
            }

            checkParent(parentID);

        }

        self.vueGlobalProp.$_state.content = content;
        if(numChanges > 0 ){
            self.vueGlobalProp.$_showMessage(`${numChanges} styles correctly replaced!`);
        } else {
            self.vueGlobalProp.$_showMessage(`No corresponding style has been found.`);
        }
    },
    expandClass: function(type, property, category, position, erase){
        const self = this;
            
        let content = self.vueGlobalProp.$_state.content;
        category = category.options[category.selectedIndex].value;
        property = property.options[property.selectedIndex].value;

        // active element
        const el = self.vueGlobalProp.$_state.activeElement;
        if (!el) return;
        const classes = el.settings._cssGlobalClasses;
        if (type === "Classes" && !classes) return self.vueGlobalProp.$_showMessage('No Class found on the element');
        let styles = [];
        for (const [key, value] of Object.entries(el.settings)) {
            if (self.helpers.isCSSControlKey(key)) styles.push({[key]: value});
        }
        if (type === "Styles" && styles.length < 1) return self.vueGlobalProp.$_showMessage('No Style found on the element');
        let parentID = el.parent;
        if(!parentID || typeof content == "undefined") parentID = false;

        function replaceClass(id){
            for(let i = 0; i < content.length; i++){
                for (const [key, value] of Object.entries(content[i])) {
                    if (key === 'id' && value === id) {
                        if(Object.getPrototypeOf(content[i].settings).length === 0) content[i].settings = {};

                        // classes
                        if (type === "Classes") {
                            if (typeof content[i].settings !== "undefined" && !content[i].settings.hasOwnProperty('_cssGlobalClasses') || erase === "true") content[i].settings._cssGlobalClasses = [];
                            classes.forEach(el => {
                                if (content[i].settings._cssGlobalClasses.includes(el)) return;
                                content[i].settings._cssGlobalClasses.push(el);
                            })
                        }

                        // styles
                        if (type === "Styles") {
                            styles.forEach(style => {
                                for (const [key, value] of Object.entries(style)) {
                                    if(property === "all" || key === property) content[i].settings[key] = JSON.parse(JSON.stringify(value));
                                }
                            })
                        }
                    }
                }
            }
        }
        function setClass(obj, id) {
            // Category check
            if(category === "all" || obj.name === category){
                replaceClass(id);
            }
            if(Object.keys(obj.children).length > 0){
                Object.keys(obj.children).forEach(function (key){
                    const newObj = self.vueGlobalProp.$_getElementObject(obj.children[key]);
                    setClass(newObj, obj.children[key]);
                });
            }
        }

        function checkParent(elemID){
            let obj;
            if(elemID !== false) obj = self.vueGlobalProp.$_getElementObject(elemID);
            
            // sibling
            
            if(position === "siblings"){
                if (obj === false) return;
                obj.children.forEach(child => {
                    const obj2 = self.vueGlobalProp.$_getElementObject(child)
                    if(category === "all" || obj2.name === category){
                        replaceClass(child);
                    }
                })

            // children

            } else if(position === "children"){
                obj = self.vueGlobalProp.$_activeElement._value;
                if (typeof obj === "undefined" || !obj.hasOwnProperty('children') || obj.children.length < 1) return;
                obj.children.forEach(child => {
                    const obj = self.vueGlobalProp.$_getElementObject(child)
                    setClass(obj, child)
                })

            // page

            } else if(position === "page"){
                content.forEach(child => {
                    if(category === "all" || child.name === category){
                        replaceClass(child.id);
                    }
                })
            
            // custom container

            } else {
                if (typeof obj === "undefined" || !obj.hasOwnProperty('children') || obj.children.length < 1) return;
                if (obj.name === position){
                    obj.children.forEach(child => {
                        const obj = self.vueGlobalProp.$_getElementObject(child)
                        setClass(obj, child)
                    })
                } else {
                    if(obj.parent) checkParent(obj.parent);
                }
            }
        }
        checkParent(parentID);
        //self.vueGlobalProp.$_state.content = content;
        self.vueGlobalProp.$_showMessage(type + ' correctly extended!');
    },
    classConverter: function(prefix, dom, copyStyles, eraseStyles){
        const self = this;

        // active element
        const el = self.vueGlobalProp.$_state.activeElement;
        if (!el) return;

        let label;
        const globalClasses = self.vueGlobalProp.$_state.globalClasses;
        
        function composeClass(prefix, element){
            (typeof element !== "undefined" && element.hasOwnProperty('label')) ? label = element.label.replace(/\s+/g, '-').toLowerCase() : label = element.name;
            return `${prefix}${label}`;
        }

        function checkchildren(prefix, element){
            if (element.children.length < 1) return;
            element.children.forEach(id => {
                
                const settings = self.vueGlobalProp.$_getElementObject(id);
                const classname = composeClass(prefix, settings);
                checkGlobalClass(classname, settings);
                checkchildren(prefix, settings);
            })
        }

        function checkGlobalClass(classname, element){
            let newClassID;
            let foundMatch = false;
            globalClasses.forEach((item) => {
                if (item.name === classname) {
                    foundMatch = true;
                    newClassID = item.id;
                    classExisting++;
                } 
            })

            if(foundMatch === true && (copyStyles.value === "skip" || self.vueGlobalProp.$_isLocked(newClassID))) {
                classSkipped++;
                return;
            }
            if(!foundMatch) {
                newClassID = self.generateGlobalClass('', classname);
                classCreated++;
            }

            // Export styles
            if(copyStyles.value === "1" || copyStyles.value === "skip"){
                const styles = [];
                for (const [key, value] of Object.entries(element.settings)) {
                    if( key === '_cssCustom'){
                        let id;
                        (typeof element.settings !== "undefined" && element.settings.hasOwnProperty('_cssId')) ? id = '#' + element.settings._cssId : id = '#brxe-' + element.id;
                        styles.push({[key]: value.replace(id, '.' + classname)});
                    } else if (self.helpers.isCSSControlKey(key)) {
                        styles.push({[key]: value});
                        if (eraseStyles.value === "1") {
                            delete element.settings[key];
                            IDstyleRemoved++;
                        }
                    }
                }

                self.vueGlobalProp.$_globalClasses.value.forEach(el => {
                    if (el.id === newClassID){
                        if(styles.lengh < 1) return;
                        el.settings = {};
                        styles.forEach((style) => {
                            for (const [key, value] of Object.entries(style)) {
                                el.settings[key] = JSON.parse(JSON.stringify(value));
                                styleExported++
                            }
                        })
                    }
                })
            }


            if (typeof element !== "undefined" && !element.hasOwnProperty('settings') || Object.getPrototypeOf(element.settings).length === 0) element.settings = {};
            if (typeof element.settings !== "undefined" && !element.settings.hasOwnProperty('_cssGlobalClasses')) element.settings._cssGlobalClasses = []
            if (typeof element.settings._cssGlobalClasses !== "undefined" && !element.settings._cssGlobalClasses.includes(newClassID)) element.settings._cssGlobalClasses.push(newClassID);

        }
        let styleExported = 0;
        let IDstyleRemoved = 0;
        let classCreated = 0;
        let classSkipped = 0;
        let classExisting = 0;
        if (dom.value !== "children-only") {
            const classname = composeClass(prefix,el);
            checkGlobalClass(classname, el);
        }
        (dom.value !== "element") ? checkchildren(prefix, el) : '';
        self.alertMsg(true, `${classCreated} class(es) created.<br>${classExisting} existing class(es) found.<br>${classSkipped} class(es) skipped.<br>${styleExported} ID Style(s) exported into the classes.<br>${IDstyleRemoved} Style(s) removed from the ID level.`, 5000);
    },
    hideElement: function(){
        const self = this;
        const activeEl = self.vueGlobalProp.$_activeElement._value;
        if(!activeEl.hasOwnProperty('settings')) activeEl.settings = {};
        activeEl.settings._display = 'none';

    },
    showElement: function(){
        const self = this;
        const activeEl = self.vueGlobalProp.$_activeElement._value;
        if(activeEl.hasOwnProperty('settings') && activeEl.settings.hasOwnProperty('_display')) delete activeEl.settings._display;
    },
    moveElement: function(position){
        const self = this;

        function move(arr, from, to, on = 1) {
            return arr.splice(to, 0, ...arr.splice(from, on)), arr
        }
        const activeEl = self.vueGlobalProp.$_state.activeElement;
        if(!activeEl) return;

        let parentEl = activeEl.parent;

        // Element is on root
        if(parentEl === 0){
            let content = self.vueGlobalProp.$_state.content;
            const indexEl = content.indexOf(activeEl);

            if (position === 'top'){

                function findpreviousEl(index){
                    if(!content[index - 1]) return;
                    if(content[index - 1].parent === 0){
                        return index - 1;
                    } else {
                        return findpreviousEl(index - 1);
                    }
                }
                const previousElIndex = findpreviousEl(indexEl);
                if(previousElIndex) content = move(content, indexEl, previousElIndex - 1, 1);

            } else if (position === "left"){
                return;

            } else if (position === "right"){
                function checkRootSiblings(index, direction){
                    let tempIndex;
                    if(direction === "backward" && index > 0 && content[index - 1]){
                        tempIndex = index - 1;
                    } else if (content[index + 1]) {
                        tempIndex = index + 1;
                        direction = "forward";
                    } else {
                        return;
                    }

                    const obj = content[tempIndex];

                    if(obj.parent !== 0 || obj.id === activeEl.id) return checkRootSiblings(tempIndex, direction);

                    const name = obj.name;
                    const isNestable = bricksData.elements[name].nestable;

                    if(!isNestable) return checkRootSiblings(tempIndex, direction);
                    
                    if(!Array.isArray(obj.children)) obj.children = [];
                    if (direction === "forward") {
                        obj.children.unshift(activeEl.id)
                    } else {
                        obj.children.push(activeEl.id)
                    }
                    activeEl.parent = obj.id;
                }
                checkRootSiblings(indexEl, "backward")
    
            } else if (position === "down"){
                function findNextEl(index){
                    if(!content[index + 1]) return;
                    if(content[index + 1].parent === 0){
                        return index + 1;
                    } else {
                        return findNextEl(index + 1);
                    }
                }
                const nextElIndex = findNextEl(indexEl);
                if(nextElIndex) content = move(content, indexEl, nextElIndex + 1, 1);
            }
            


        // Element is nested inside the structure
        } else {
            const currentEl = activeEl.id;
            let parentObj = self.vueGlobalProp.$_getElementObject(parentEl);
            let parentChildren = parentObj.children;

            if (position === 'top'){
                let currentIndex = parentChildren.indexOf(currentEl);
                const newChildren = move(parentChildren, currentIndex, currentIndex - 1, 1);
                parentChildren = newChildren;
    
            } else if (position === "left"){
                   
                const grandFatherId = parentObj.parent;
                const grandFatherObj = (grandFatherId !== 0) ? self.vueGlobalProp.$_getElementObject(grandFatherId) : false;
                const grandFatherChildren = (grandFatherObj) ? grandFatherObj.children : false;
    
                // parent is on root
                if(!grandFatherId){
                    let content = self.vueGlobalProp.$_state.content;
                    self.vueGlobalProp.$_state.content = move(content, content.indexOf(activeEl), content.indexOf(parentObj) + 1, 1)
                    parentChildren.splice(parentChildren.indexOf(currentEl), 1);
                    self.vueGlobalProp.$_state.activeElement.parent = 0;
                } else {
                    // has grandfather
                    grandFatherChildren.push(currentEl);
                    grandFatherObj.children = move(grandFatherChildren, grandFatherChildren.indexOf(currentEl), grandFatherChildren.indexOf(parentObj.id) + 1, 1);
                    parentChildren.splice(parentChildren.indexOf(currentEl), 1);
                    self.vueGlobalProp.$_state.activeElement.parent = grandFatherId;
                }
                
            } else if (position === "right"){
                const currentIndex = parentChildren.indexOf(currentEl);
                
                function checkRootSiblings(index, direction){
                    let tempIndex;
                    if(direction === "backward" && index > 0 && parentChildren[index - 1]){
                        tempIndex = index - 1;
                    } else if (parentChildren[index + 1]) {
                        tempIndex = index + 1;
                        direction = "forward";
                    } else {
                        return;
                    }

                    const obj = self.vueGlobalProp.$_getElementObject(parentChildren[tempIndex]);
                    if(obj.id === currentEl) return checkRootSiblings(tempIndex, direction);

                    const name = obj.name;
                    const isNestable = bricksData.elements[name].nestable;

                    if(!isNestable) return checkRootSiblings(tempIndex, direction);
                    
                    if(!Array.isArray(obj.children)) obj.children = [];
                    parentChildren.splice(parentChildren.indexOf(currentEl), 1);
                    activeEl.parent = obj.id;
                    if (direction === "forward") {
                        obj.children.unshift(currentEl)
    
                    } else {
                        obj.children.push(currentEl)
                    }
                }
                checkRootSiblings(currentIndex, "backward");
    
            } else if (position === "down"){
                let currentIndex = parentChildren.indexOf(currentEl);
                const newChildren = move(parentChildren, currentIndex, currentIndex + 1, 1);
                parentChildren = newChildren;
    
            }

        }
        
    },
    setContextualMenuItems: function(){
        const self = this;
        let contextualMenu = document.querySelector("#bricks-builder-context-menu").children[0].children[0];
        let icons = '';
        if(self.helpers.isBuilderTweaksTabActive('structure-panel')){
            (Object.values(self.globalSettings.structurePanelContextualMenu).includes('hide-element')) ? icons += `<li id="hideElement" onClick='ADMINBRXC.hideElement()'>Hide Element</li>`: '';
            (Object.values(self.globalSettings.structurePanelContextualMenu).includes('move-element')) ? icons += `<li id="moveElement"><span class="label">Move</span><div class="buttons"><span class="action" data-balloon="Indent Left" data-balloon-pos="top" onClick="ADMINBRXC.moveElement('left');"><i class="fas fa-arrow-left"></i></span><span class="action" data-balloon="Indent Right" data-balloon-pos="top" onClick="ADMINBRXC.moveElement('right');"><i class="fas fa-arrow-right"></i></span><span class="action" data-balloon="Move Up" data-balloon-pos="top" onClick="ADMINBRXC.moveElement('top');"><i class="fas fa-arrow-up"></i></span><span class="action" data-balloon="Move Down" data-balloon-pos="top-right" onClick="ADMINBRXC.moveElement('down');"><i class="fas fa-arrow-down"></i></span></div></li>`: '';
            (Object.values(self.globalSettings.structurePanelContextualMenu).includes('extend-classes-and-styles')) ? icons += `<li id="brxcExpandClasses" onClick='ADMINBRXC.openExtendClassModal(event,"#brxcExtendModal")'>Extend Classes & Styles</li>`: '';
            (Object.values(self.globalSettings.structurePanelContextualMenu).includes('find-and-replace-styles')) ? icons += `<li id="brxcFindandReplaceStyles" onClick='ADMINBRXC.openFindReplaceModal(event,false, "#brxcFindReplaceModal")'>Find & Replace Styles</li>`: '';
            (Object.values(self.globalSettings.structurePanelContextualMenu).includes('class-converter')) ? icons += `<li class="sep" id="brxcBEMConverter" onClick='document.querySelector("#brxcClassConverterOverlay #brxcClassConverterClassPrefix").value = "";ADMINBRXC.openModal(false, "#brxcClassConverterOverlay")';'>Class Converter</li>` : '';
        }

        contextualMenu.insertAdjacentHTML("beforeBegin", icons);
    },
    toggleTagsState: function (){
        const self = this;
        if(self.vueGlobalProp.$_state.brxc.tagsView === 'developer'){
            self.vueGlobalProp.$_state.brxc.tagsView = 'none';
        } else if (self.vueGlobalProp.$_state.brxc.tagsView === 'none'){
            self.vueGlobalProp.$_state.brxc.tagsView = 'overview'
        }  else if (self.vueGlobalProp.$_state.brxc.tagsView === 'overview'){
            self.vueGlobalProp.$_state.brxc.tagsView = 'developer';
        }
        self.showTagInStructurePanel()
    },
    setHeaderStructurePanel: function(){
        const self = this;
        let header = document.querySelector("#bricks-structure #bricks-panel-header ul.actions li");
        let icons = '';
        if(header && Object.values(self.globalSettings.structurePanelIcons).includes('find-and-replace')){
            icons += `<li data-balloon="Find & replace" onClick='ADMINBRXC.openFindReplaceModal(event,true, "#brxcFindReplaceModal")' data-balloon-pos="bottom-right"><span class="bricks-svg-wrapper"><!--?xml version="1.0" encoding="UTF-8"?--><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" class="bricks-svg"><path xmlns="http://www.w3.org/2000/svg" d="M138 484q18-110 103.838-182T440 230q75 0 133 30.5t98 82.5v-98h72v239H503v-71h100q-27-42-70.5-65T440 325q-72.187 0-130.093 43.5Q252 412 234 484h-96Zm674 492L615 780q-34 27-78 43.5T440.217 840Q367 840 308.5 813 250 786 209 734v93h-72V588h240v71H271q28.269 41.15 72.541 64.075Q387.812 746 440 746q72.102 0 127.444-44.853T642 588h96q-5 33-19 65.5T684 713l197 196-69 67Z"/></svg></span></li>`;
        }
        if(header && Object.values(self.globalSettings.structurePanelIcons).includes('tags')){
            icons += `<li data-balloon="Show Elements Tag" onClick='ADMINBRXC.toggleTagsState();' data-balloon-pos="bottom"><span class="bricks-svg-wrapper"><i class="fas fa-tag"></i></span></li>`;
        }
        header.insertAdjacentHTML("beforeBegin", icons);
    },
    setControlsOptions: function(){
        const self = this;
        const allElements = [];
        const allControls = [];

        for (const [key, value] of Object.entries(bricksData.elements)) {
            const el1 = key;
            const el2 = value;
            allElements.push([el2.name,el2.label]);
            for (const [key, value] of Object.entries(bricksData.elements[el1].controls)) {
                if (typeof value !== "undefined" && value.hasOwnProperty('css'))self.CSScontrolKeys.push(key)
                if (key.startsWith('_') && value.hasOwnProperty('css')) {
                    if(key === "_flexDirection"){
                        allControls.push([key,"Flex direction"]);
                    } else if(key === "_innerContainerMargin"){
                        allControls.push([key,"Inner Container margin"]);
                    } else if(key === "_innerContainerPadding"){
                        allControls.push([key,"Inner Container padding"]);
                    } else if(key === "_rowGapColors"){
                        allControls.push([key,"Row gap (Colors)"]);
                    } else if(key === "_gridGap"){
                        allControls.push([key,"Grid gap"]);
                    } else if(typeof value !== "undefined" && value.hasOwnProperty('label')) {
                        allControls.push([key,value.label])
                    } else {
                        (value.type) ? allControls.push([key,value.type.charAt(0).toUpperCase() + value.type.slice(1)]) : '';
                    }
                }
            }
        }
        self.CSScontrolKeys = [... new Set(self.CSScontrolKeys)];

        const categoryWrappers = document.querySelectorAll('.brxc-categoryOptions');
        self.globalSettings.elements = allElements
            .filter((item, index, self) => index === self.findIndex((inner) => inner[0] === item[0] && inner[1] === item[1]))
            .sort((a, b) => (a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0));
        (categoryWrappers.length > 0) ? categoryWrappers.forEach(wrapper => {
            self.globalSettings.elements.forEach(el => {
                wrapper.innerHTML += `<option value="${el[0]}">${el[1]}</option>` 
            })
        }) : '';

        const propertyWrappers = document.querySelectorAll('.brxc-propertyOptions');
        self.globalSettings.styleControls = allControls
            .filter((item, index, self) => index === self.findIndex((inner) => inner[0] === item[0] && inner[1] === item[1]))
            .sort((a, b) => (a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0));
        (propertyWrappers.length > 0) ? propertyWrappers.forEach(wrapper => {
            self.globalSettings.styleControls.forEach(control => {
                wrapper.innerHTML += `<option value="${control[0]}">${control[1]}</option>` 
            })
        }) : '';


    },
    reorderClasses: function(){
       const self = this;
       if(self.vueGlobalProp.$_state.globalClasses && typeof self.vueGlobalProp.$_state.globalClasses === "object") self.vueGlobalProp.$_state.globalClasses.sort((a, b) => { if (a.name < b.name) return -1; if (a.name > b.name) return 1; return 0; });
    },
    resizableStructurePanel: function(){
        const self = this;
        const panel = document.querySelector('#bricks-structure');
        const main = panel.querySelector('main.panel-content')
        const preview = document.querySelector('#bricks-preview');
        const resizeBox  = document.createElement("DIV");
        resizeBox.setAttribute("id", "brxcResizeBox");
        main.appendChild(resizeBox);

        let startX, startWidth;

        const initDrag = (e) => {
        preview.style.pointerEvents = "none";
        panel.style.pointerEvents = "none";
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
        }

        const doDrag = (e) => {
        panel.style.width = (startWidth + -e.clientX + startX) + 'px';
        let style = document.querySelector('#brxcstructurePanelMargin');
        if(!style){
            style = document.createElement("STYLE");
            style.setAttribute("id", "brxcstructurePanelMargin");
            document.head.appendChild(style);
        }
        style.innerHTML = '#bricks-preview.show-structure {margin-right: ' + (startWidth + -e.clientX + startX) + 'px;}';
        }

        const stopDrag = (e) => {
            preview.style.pointerEvents = "auto";
            panel.style.pointerEvents = "auto";
            document.documentElement.removeEventListener('mousemove', doDrag, false);    
            document.documentElement.removeEventListener('mouseup', stopDrag, false);
        }

        resizeBox.addEventListener('mousedown', initDrag, false);


    },
    setRightShortcutCol: function(){
        const self = this;
        const structure = document.querySelector('#bricks-structure');
        structure.setAttribute('data-has-shortcuts-sidebar', 'true');
        const structurePanel = structure.querySelector('main.panel-content');
        let rightCol = `<div class="brxce-panel-shortcut__wrapper">
                            <div class="brxce-panel-shortcut__container">`;
        for (let i = 0; i < self.globalSettings.createElementsShortcuts.length; i++) { 
            for (let key in self.vueGlobalProp.bricks.elements) { 
                if (self.vueGlobalProp.bricks.elements[key].name === self.globalSettings.createElementsShortcuts[i]) { 
                    const el = self.vueGlobalProp.bricks.elements[key];
                    rightCol += `<li data-panel="${el.name}" data-balloon="${el.label}" data-balloon-pos="left" data-name="${el.name}" class="brxc-right-sidebar-shortcuts"><span class="bricks-svg-wrapper"><i class="${el.icon}"></i></span></li>`;
                } 
            } 
        } 
        rightCol += `</div></div>`;
        structurePanel.insertAdjacentHTML(
            'afterend',
            rightCol
        );
        const icons = structure.querySelectorAll(' li.brxc-right-sidebar-shortcuts');
        icons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const elName = icon.dataset.name;
                const id = self.vueGlobalProp.$_generateId();
                let parentId;

                // Check parent
                if(typeof self.vueGlobalProp.$_state.activeElement === 'undefined' || (self.vueGlobalProp.$_state.activeElement.parent === 0 && !self.vueGlobalProp.$_isNestable())){
                    parentId = 0;
                } else if(self.vueGlobalProp.$_isNestable()){
                    parentId = self.vueGlobalProp.$_state.activeId; 
                    self.vueGlobalProp.$_getElementObject(parentId).children.push(id)
                } else {
                    parentId = self.vueGlobalProp.$_state.activeElement.parent;
                    self.vueGlobalProp.$_getElementObject(parentId).children.push(id)
                }

                const newElement = self.vueGlobalProp.$_createElement({name: elName, parent: parentId});
                newElement.id = id;
                if(self.vueGlobalProp.$_state.templateType === "header") {
                    self.vueGlobalProp.$_state.header.push(newElement)
                } else if(self.vueGlobalProp.$_state.templateType === "footer") {
                    self.vueGlobalProp.$_state.footer.push(newElement);
                } else {
                    self.vueGlobalProp.$_state.content.push(newElement);
                }
                if (e.shiftKey) self.vueGlobalProp.$_state.activeId = id;
                setTimeout(() => self.showTagInStructurePanel(), 0);
            })
        })


    },
    setBricksLabs: function (content){
        if(!content || content.length < 1) return;
        const canvas = document.querySelector('#brxcBricksLabsOverlay #brxc-overlay__canvas');
        let output = `<div class="brxc-article__container">`;
        content.forEach(article => {
            const rawDate = new Date(article.date);
            const date = rawDate.toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"});
            output += `<div class="brxc-article__wrapper">
                <div class="brxc-article__col-left">
                <a href="${article.link}" target="_blank"><img src="${article.featured_image_src_square}" /></a>
                </div>
                <div class="brxc-article__col-right">
                    <a href="${article.link}" target="_blank"><h3>${article.title.rendered}</h3></a>
                    <p class="brxc-article__author-wrapper"><i class="brxc-article__author-icon fas fa-calendar-days"></i>${date}<span class="brxc-article__author">by <strong>${article.author_info.display_name}</strong></span></p>
                    <span class="brxc-article__excerpt">${article.excerpt.rendered}</span>
                    <a href="${article.link}" class="brxc-overlay__action-btn secondary brxc-article__readmore" target="_blank">Read more</a>
                </div>
            </div>`;
        })
        output += `</div>`;
        canvas.innerHTML = output;
    },
    bricksLabsAPI: function(target, query = false, openModal = false){
        const self = this;
        (target) ? target.classList.add('disable') : '';
        const wrapper = document.querySelector('#brxcBricksLabsOverlay');

        if(openModal === true && wrapper.dataset.loaded === "true") {
            return;
        }

        let url;
        (query) ? url = 'https://brickslabs.com/wp-json/wp/v2/posts?search=' + query.replace(/\s+/g, '+') : url = 'https://brickslabs.com/wp-json/wp/v2/posts';
        const post = async () => {
            const rawResponse = await fetch(url);
            const content = await rawResponse.json();
            if(content.error){
                console.log('error');
                (target) ? target.classList.remove('disable') : '';
            } else {
                self.setBricksLabs(content);
                wrapper.setAttribute('data-loaded', 'true');
                (target) ? target.classList.remove('disable') : '';
            }
        };

        post();
            
    },
    setBreakpointsAttributes: function(){
        const self = this;
        const icons = document.querySelectorAll('#bricks-toolbar .group-wrapper.breakpoints li.breakpoint');
        const breakpoints = self.vueGlobalProp.$_state.breakpoints;
        breakpoints.forEach(({ label, key }) => {
            icons.forEach(icon => {
              const text = icon.dataset.balloon;
              if (text.includes(label)) {
                icon.dataset.key = key;
              }
            });
        });
    },
    alertMsg: function(autoremove = true, msg, delay){
        const wrapper = document.querySelector('#brxc-alert-message');
        let message = document.createElement('DIV');
        message.setAttribute("id", "brxcAlertMessageContent");
        message.innerHTML = msg;
        setTimeout(() => {
            wrapper.appendChild(message);
            wrapper.classList.add('active');
        }, 
        setTimeout(() => {
            if(autoremove){
                message = document.querySelector('#brxcAlertMessageContent');
                message.remove();
                wrapper.classList.remove('active');
            }
        }, delay))
    },
    setAlertMsg: function(){
        const msg = document.querySelector('#bricks-message');
        const html = `<div id="brxc-alert-message"></div>"`;
        msg.insertAdjacentHTML("afterend", html);
    },
    setStructurePanelKeyboardShortcuts: function(){
        const self = this;
        document.addEventListener('keydown', function(e) {
            (e.shiftKey && e.key === "ArrowUp") ? self.moveElement('top') : '';
            (e.shiftKey && e.key === "ArrowRight") ? self.moveElement('right') : '';
            (e.shiftKey && e.key === "ArrowDown") ? self.moveElement('down') : '';
            (e.shiftKey && e.key === "ArrowLeft") ? self.moveElement('left') : '';
        });

    },
    initStates: function(){
        const self = this;
        self.vueGlobalProp.$_state.brxcShowImportInput = false;
        self.vueGlobalProp.$_state.brxcShowLock = true;
        self.vueGlobalProp.$_state.brxc.tagsView = self.globalSettings.structurePanelTagDefaultView;
    },
    initProxyObservers: function(){
        const self = this;
        const handler = {
            set: function(target, key, value) {
               //console.log(`Property '${key}' is changed from '${target[key]}' to '${value}'`);

                // BreakpointActive changes
                if (key === 'breakpointActive'){
                    self.setBreakpontIndicatorStatus(value);
                    self.panelShortcutsActive(true);
                }
                target[key] = value;
              return true;
            }
          };
          
          const watchedData = new Proxy(self.vueGlobalProp.$_state, handler);
          
          self.vueGlobalProp.$_state = watchedData
    },
    populateNestableElements: function(){
        const self = this;
        for(const [key, value] of Object.entries(bricksData.elements)){
            if(bricksData.elements[key].hasOwnProperty('nestableChildren') && bricksData.elements[key].nestableChildren !== null && key !== "section" ) self.nestableElements.push(key);
        }        
    },
    disableMoveElement: function(){
        const self = this;
        const contextualMenu = document.querySelector('#bricks-builder-context-menu');
        const left = contextualMenu.querySelector('span[data-balloon="Indent Left"]');
        const right = contextualMenu.querySelector('span[data-balloon="Indent Right"]');
        const up = contextualMenu.querySelector('span[data-balloon="Move Up"]');
        const down = contextualMenu.querySelector('span[data-balloon="Move Down"]');

        // disable indent left
        left.classList.remove('disable');
        if(typeof self.vueGlobalProp.$_state.activeElement !== "undefined" && self.vueGlobalProp.$_state.activeElement.parent === 0) left.classList.add('disable');

        // disable indent right
        right.classList.remove('disable');
        if(typeof self.vueGlobalProp.$_state.activeElement !== "undefined" ) {
            // element is on root
            if(self.vueGlobalProp.$_state.activeElement.parent === 0){
                let hasContainer = false
                self.vueGlobalProp.$_state.content.forEach(el => {
                    if(el.parent === 0 && el.id !== self.vueGlobalProp.$_state.activeElement.id && bricksData.elements[el.name].nestable === true) hasContainer = true;
                })
                if(!hasContainer) right.classList.add('disable');
            // element is nested
            } else {
                const parent = self.vueGlobalProp.$_state.activeElement.parent;
                const parentChildren = self.vueGlobalProp.$_getElementObject(parent).children;
                let hasNestable = false;
                parentChildren.forEach(el =>{
                    if (el === self.vueGlobalProp.$_state.activeElement.id) return;
                    if (bricksData.elements[self.vueGlobalProp.$_getElementObject(el).name].nestable === true) hasNestable = true;
                })
                if (hasNestable === false) right.classList.add('disable');
            }
        }
        //disable move up & down
        up.classList.remove('disable');
        down.classList.remove('disable');
        if(typeof self.vueGlobalProp.$_state.activeElement !== "undefined" ) {
            // element is on root
            if(self.vueGlobalProp.$_state.activeElement.parent === 0){
                const content = self.vueGlobalProp.$_state.content;
                const activeEl = self.vueGlobalProp.$_state.activeElement;
                let hasPrevious = false;
                let hasNext = false
                for(let i = content.indexOf(activeEl); i < content.length; i++){
                    if(content[i].parent === 0 && content[i].id !== activeEl.id) hasNext = true;
                }
                for(let i = content.indexOf(activeEl); i > -1; i--){
                    if(content[i].parent === 0 && content[i].id !== activeEl.id) hasPrevious = true;
                }
                if(!hasPrevious) up.classList.add('disable');
                if(!hasNext) down.classList.add('disable');

            // element is nested
            } else {
                const parent = self.vueGlobalProp.$_state.activeElement.parent;
                const parentChildren = self.vueGlobalProp.$_getElementObject(parent).children;
                const currentIndex = parentChildren.indexOf(self.vueGlobalProp.$_state.activeElement.id);
                if(!parentChildren[currentIndex - 1]) up.classList.add('disable');
                if(!parentChildren[currentIndex + 1]) down.classList.add('disable');
            }
        }

    },
    showHideElement: function(){
        const self = this;
        const hideElement = document.querySelector('#hideElement');
        const activeEl = self.vueGlobalProp.$_state.activeElement;
        if (!hideElement || typeof activeEl === "undefined") return;
        if(activeEl.hasOwnProperty('settings') && activeEl.settings.hasOwnProperty('_display') && activeEl.settings._display === "none") {
            hideElement.textContent = "Show Element";
            hideElement.setAttribute("onclick", "ADMINBRXC.showElement()");
        } else {
            hideElement.textContent = "Hide Element";
            hideElement.setAttribute("onclick", "ADMINBRXC.hideElement()");
        }
    },
    setDeleteWrapper: function(){
        const self = this;
        const contextualMenu = document.querySelector("#bricks-builder-context-menu");
        const deleteIcon = contextualMenu.querySelector('li.delete');
        if (!deleteIcon) return; 
        const buttons = deleteIcon.querySelector('div.buttons');
        if (buttons) buttons.remove();
        if(typeof self.vueGlobalProp.$_state.activeElement === "undefined" || !self.vueGlobalProp.$_state.activeElement.hasOwnProperty('children') || !Array.isArray(self.vueGlobalProp.$_state.activeElement.children) || self.vueGlobalProp.$_state.activeElement.children.length < 1) return;
        let icon = `<div class="buttons"><span class="action" data-balloon="Move Children Up" data-balloon-pos="top-right" onClick="ADMINBRXC.deleteWrapper(event);"><i class="fas fa-trash-can-arrow-up"></i></span></div>`;
        deleteIcon.innerHTML += icon;
    },
    deleteWrapper: function(){
        const self = this;
        const activeEl = self.vueGlobalProp.$_state.activeElement;
        if (typeof activeEl === "undefined" || !self.vueGlobalProp.$_state.activeElement.hasOwnProperty('children') || !Array.isArray(activeEl.children) || activeEl.children.length < 1)  return;
        const parent = activeEl.parent;
        const children = activeEl.children;
        // Element is on root
        if(parent === 0){
            children.forEach(child => {
                self.vueGlobalProp.$_getElementObject(child).parent = 0;
            })
            activeEl.children = [];
        // Element is nested
        } else {
            let parentChildren = self.vueGlobalProp.$_getElementObject(parent).children;
            children.forEach(child => {
                self.vueGlobalProp.$_getElementObject(child).parent = parent;
                parentChildren.push(child);
            })
            activeEl.children = [];
            //self.vueGlobalProp.$_deleteElement(activeEl);

        }
    },
    initContextualMenuObservers: function(){
        const self = this
        const contextualMenu = document.querySelector('#bricks-builder-context-menu');

        const observer = new MutationObserver(function(mutation) {
            //Contextual menu open
            if(mutation[0].target.className === "show") {
                if(self.helpers.isBuilderTweaksTabActive('structure-panel')){
                    (Object.values(self.globalSettings.structurePanelContextualMenu).includes('move-element')) ? self.disableMoveElement() : '';
                    (Object.values(self.globalSettings.structurePanelContextualMenu).includes('hide-element')) ? self.showHideElement() : '';
                    (Object.values(self.globalSettings.structurePanelContextualMenu).includes('delete-wrapper')) ? self.setDeleteWrapper(): '';
                }
            }
        });

        observer.observe(contextualMenu, { subtree: true, childList: false, attributes: true, attributeFilter: ['class'] });
    },
    init: function(){
        const self = this;
        self.vueGlobalProp.$_state.brxc = [];
        self.initStates();
        self.initObservers();
        self.initProxyObservers();
        self.initContextualMenuObservers();
        self.setIsotope();
        self.setCodeMirror();
        self.setControlsOptions();
        self.toggleRadioVisibility();
        self.setAlertMsg();
        // AI
        (self.helpers.isAIActive()) ? self.initAcc('.accordion.v1', true) : '';

        // Classes & Styles
        (self.helpers.isClassesAndStylesTabActive('class-importer') ) ? self.importedClasses() : '';
        (self.helpers.isClassesAndStylesTabActive('grids') ) ? self.importedGrids() : '';

        // Builder Tweaks
        //// Topbar
        if(self.helpers.isBuilderTweaksTabActive('global-features')){
            Object.values(self.globalSettings.globalFeatures).includes('GridGuide') ? self.initGridGuide() : '';
        }

        //// Structure Panels
        if(self.helpers.isBuilderTweaksTabActive('structure-panel')){
            (self.globalSettings.structurePanelContextualMenu.length > 0) ? self.setContextualMenuItems() : '';
            (self.globalSettings.structurePanelIcons.length > 0) ? self.setHeaderStructurePanel() : '';
            Object.values(self.globalSettings.structurePanelGeneralTweaks).includes('resizable-structure-panel') ? self.resizableStructurePanel() : '';
            Object.values(self.globalSettings.structurePanelGeneralTweaks).includes('new-element-shortcuts') && self.globalSettings.createElementsShortcuts.length>0 ? self.setRightShortcutCol() : '';
            Object.values(self.globalSettings.structurePanelGeneralTweaks).includes('styles-and-classes-indicators') ? self.setColorsforStructureIndicators() : '';
            Object.values(self.globalSettings.structurePanelGeneralTweaks).includes("highlight-nestable-elements") ? self.populateNestableElements() : '';

        } 

        //// Classes and Styles
        if(self.helpers.isBuilderTweaksTabActive('classes-and-styles')){
            Object.values(self.globalSettings.classFeatures).includes("disable-id-styles") ? document.body.setAttribute('data-disable-styles', "true") : '';
            Object.values(self.globalSettings.classFeatures).includes("reorder-classes") ? self.reorderClasses() : '';
            Object.values(self.globalSettings.classFeatures).includes("locked-class-indicator") ? document.body.setAttribute('data-locked-classes', "true") : '';
            Object.values(self.globalSettings.classFeatures).includes("autocomplete-variable") ? self.populateCSSVariables() : '';
        }

        //// Elements
        if(self.helpers.isBuilderTweaksTabActive('elements')){
            Object.values(self.globalSettings.elementFeatures).includes("pseudo-shortcut") ? self.setDefaultPseudoClasses() : '';
            Object.values(self.globalSettings.elementFeatures).includes("resize-elements-icons") ? self.setElementsColumns() : '';
        }

        //// Keyboard Shortcuts
        if(self.helpers.isBuilderTweaksTabActive('keyboard-shortcuts')){
            Object.values(self.globalSettings.keyboardShortcuts.options).includes("move-element") ?self.setStructurePanelKeyboardShortcuts() : '';
            Object.values(self.globalSettings.keyboardShortcuts.options).includes("open-at-modal") ? self.setKeyboardShortcuts() : '';
        }

    }
}
//ADMINBRXC.initPageCSS()
window.addEventListener('DOMContentLoaded', () => {
    ADMINBRXC.initToolbar();
})
window.addEventListener('load', () => {
    if (ADMINBRXC.helpers.isClassesAndStylesTabActive('grids') === false && typeof ADMINBRXC.vueGlobalProp.$_state !== "undefined") {
        if(ADMINBRXC.vueGlobalProp.$_state.hasOwnProperty('globalClasses')) ADMINBRXC.vueGlobalProp.$_state.globalClasses = Array.from(ADMINBRXC.vueGlobalProp.$_state.globalClasses).filter(item => !item.id.startsWith("brxc_grid"));
        if(ADMINBRXC.vueGlobalProp.$_state.hasOwnProperty('globalClassesLocked')) ADMINBRXC.vueGlobalProp.$_state.globalClassesLocked = ADMINBRXC.vueGlobalProp.$_state.globalClassesLocked.filter(item => !item.startsWith("brxc_grid"));
        if(Array.isArray(ADMINBRXC.vueGlobalProp.$_state.unsavedChanges)) ADMINBRXC.vueGlobalProp.$_state.unsavedChanges.push('globalClasses');
        if(Array.isArray(ADMINBRXC.vueGlobalProp.$_state.unsavedChanges)) ADMINBRXC.vueGlobalProp.$_state.unsavedChanges.push('globalClassesLocked')
    }
    if (ADMINBRXC.helpers.isClassesAndStylesTabActive('class-importer') === false && typeof ADMINBRXC.vueGlobalProp.$_state !== "undefined") {
        if(ADMINBRXC.vueGlobalProp.$_state.hasOwnProperty('globalClasses')) ADMINBRXC.vueGlobalProp.$_state.globalClasses = ADMINBRXC.vueGlobalProp.$_state.globalClasses.filter(item => !item.id.startsWith("brxc_imported"));
        if(ADMINBRXC.vueGlobalProp.$_state.hasOwnProperty('globalClassesLocked')) ADMINBRXC.vueGlobalProp.$_state.globalClassesLocked = ADMINBRXC.vueGlobalProp.$_state.globalClassesLocked.filter(item => !item.startsWith("brxc_imported"));
        if(Array.isArray(ADMINBRXC.vueGlobalProp.$_state.unsavedChanges)) ADMINBRXC.vueGlobalProp.$_state.unsavedChanges.push('globalClasses');
        if(Array.isArray(ADMINBRXC.vueGlobalProp.$_state.unsavedChanges)) ADMINBRXC.vueGlobalProp.$_state.unsavedChanges.push('globalClassesLocked')
    } 

    // Lock imported classes and grid
    if (ADMINBRXC.vueGlobalProp.$_state.globalClasses.length > 0){
        if(!Array.isArray(ADMINBRXC.vueGlobalProp.$_state.globalClassesLocked)) ADMINBRXC.vueGlobalProp.$_state.globalClassesLocked = [];
        ADMINBRXC.vueGlobalProp.$_state.globalClasses.forEach(el => {
            if(el.id.startsWith("brxc_imported") || el.id.startsWith("brxc_grid")){
                ADMINBRXC.vueGlobalProp.$_state.globalClassesLocked.push(el.id);
            }
        })
        ADMINBRXC.vueGlobalProp.$_state.globalClassesLocked = [...new Set(ADMINBRXC.vueGlobalProp.$_state.globalClassesLocked)];
        if(Array.isArray(ADMINBRXC.vueGlobalProp.$_state.unsavedChanges)) ADMINBRXC.vueGlobalProp.$_state.unsavedChanges.push('globalClassesLocked')
    } 
    
 

    ADMINBRXC.init()
    document.querySelectorAll('.brxc-overlay__wrapper').forEach(el => el.removeAttribute('style'));
    (ADMINBRXC.helpers.isBuilderTweaksTabActive('elements') && Object.values(ADMINBRXC.globalSettings.elementFeatures).includes("tabs-shortcuts") && ADMINBRXC.globalSettings.shortcutsTabs.length > 0) ? document.body.classList.add('brxc-has-panel-shortcuts') : '';
})