
function xToggleSwitch(){

    function positionToggleSlider(toggleSlider,activeLabel) {

        if ( toggleSlider ) {

            toggleSlider.style.left = activeLabel.offsetLeft + "px",
            toggleSlider.style.width = activeLabel.offsetWidth + 1 +"px",
            toggleSlider.style.height = activeLabel.offsetHeight + 1 + "px"
            toggleSlider.style.top = activeLabel.offsetTop + "px"

        }

    }

    const extrasToggleSwitch = function ( container ) {
  
    container.querySelectorAll(".x-toggle-switch").forEach((toggleSwitch) => {

        const configAttr = toggleSwitch.getAttribute('data-x-switch')
        const elementConfig = configAttr ? JSON.parse(configAttr) : {}

        let contentSwitcherSelector = 'section' === elementConfig.contentSwitcher ? false : elementConfig.contentSwitcher,
            contentSwitchers   
            
            
        if (!contentSwitcherSelector) {
            contentSwitchers = toggleSwitch.closest('section').querySelectorAll('.x-content-switcher_content')    
        } else {
            contentSwitchers = container.querySelectorAll(contentSwitcherSelector + ' .x-content-switcher_content')
        }

        contentSwitchers.forEach((contentSwitcher) => {

            let contentSwitcherIdentifier = contentSwitcher.parentElement.getAttribute('data-x-id')

            contentSwitcher.querySelectorAll('.x-content-switcher_block').forEach((contentSwitcherBlock, index) => {

                if (! contentSwitcherBlock.hasAttribute('id') ) {
                    contentSwitcherBlock.setAttribute('id', contentSwitcherIdentifier + '_' + index)
                }

                if ( 'multiple' === elementConfig.type ) { 

                    contentSwitcherBlock.setAttribute('role','tabpanel')
                    contentSwitcherBlock.setAttribute('tabindex', '0')

                    toggleSwitch.querySelectorAll('.x-toggle-switch_labels .x-toggle-switch_label').forEach((toggleLabel,i) => {

                        if (index === i) {  
                            toggleLabel.setAttribute(
                                'aria-controls', 
                                (toggleLabel.getAttribute('aria-controls') || '') + ' ' + contentSwitcherBlock.id)

                            contentSwitcherBlock.setAttribute('aria-labelledby', toggleLabel.id)     
                        }

                    })

                }

            })

        }) 

            
        if ( 'double' === elementConfig.type ) { 

            toggleSwitch.addEventListener('change', (event)=> {

                toggleSwitch.dispatchEvent(new Event('x_toggle_switch:change'))

                if ( event.target.closest('.x-toggle-switch_switch').classList.contains( 'x-toggle-switch_toggled' ) ) {
                    toggleSwitch.dispatchEvent(new Event('x_toggle_switch:unchecked'))
                    event.target.closest('.x-toggle-switch_switch').classList.remove('x-toggle-switch_toggled');
                } else {
                    event.target.closest('.x-toggle-switch_switch').classList.add('x-toggle-switch_toggled');
                    toggleSwitch.dispatchEvent(new Event('x_toggle_switch:checked'))
                }

                if ( document.querySelector('body > .brx-body.iframe') ) {
                    return
                }
        
                if (!contentSwitcherSelector) {
                    contentSwitchers = event.target.closest('section').querySelectorAll('.x-content-switcher_content')    
                } else {
                    contentSwitchers = container.querySelectorAll(contentSwitcherSelector + ' .x-content-switcher_content')
                }
        
                contentSwitchers.forEach((contentSwitcher) => {

                    if ( contentSwitcher.hasAttribute('data-x-switcher') ) {
                        contentSwitcher.removeAttribute('data-x-switcher')
                    }
        
                    if ( contentSwitcher.classList.contains( 'x-content-switcher_toggled' ) ) {
                        contentSwitcher.classList.remove( 'x-content-switcher_toggled' )
                    } else {
                        contentSwitcher.classList.add( 'x-content-switcher_toggled' )
                    }
        
                })
            })
        } else {

            let tabFocus = 0;
            const tabs = toggleSwitch.querySelectorAll('.x-toggle-switch_label')

            toggleSwitch.querySelector('.x-toggle-switch_labels').addEventListener("keydown", (e) => {
                // Move right
                if (e.keyCode === 39 || e.keyCode === 37) {
                  tabs[tabFocus].setAttribute("tabindex", -1);
                  if (e.keyCode === 39) {
                    tabFocus++;
                    // If we're at the end, go to the start
                    if (tabFocus >= tabs.length) {
                      tabFocus = 0;
                    }
                    // Move left
                  } else if (e.keyCode === 37) {
                    tabFocus--;
                    // If we're at the start, move to the end
                    if (tabFocus < 0) {
                      tabFocus = tabs.length - 1;
                    }
                  }

                  tabs[tabFocus].setAttribute("tabindex", 0);
                  tabs[tabFocus].focus();

                }

            })

            toggleSwitch.addEventListener('click', (event) => {

                if (!event.target || !event.target.className == 'x-toggle-switch_label' || 'BUTTON' !== event.target.tagName ) {
                    return
                }

                toggleSwitch.dispatchEvent(new Event('x_toggle_switch:change'))
        
                const parentSwitch = event.target.closest('.x-toggle-switch_labels')
                for (const child of parentSwitch.children) {
        
                    if ( child.classList.contains('x-toggle-switch_label') ) {
                        child.classList.remove('x-toggle-switch_label-active')
                        child.setAttribute('aria-selected', 'false')
                        child.setAttribute('tabindex', '-1')
                    }
                }
        
                event.target.classList.add('x-toggle-switch_label-active')
                event.target.setAttribute('aria-selected', 'true')
                event.target.setAttribute('tabindex', '0')
        
                positionToggleSlider(parentSwitch.parentNode.querySelector('.x-toggle-switch_multiple-slider'),event.target)
        
        
                let labelIndex = Array.prototype.indexOf.call(event.target.parentNode.children, event.target) + 1;

                if ( document.querySelector('body > .brx-body.iframe') ) {
                    return
                }
                
                if (!contentSwitcherSelector) {
                    contentSwitchers = event.target.closest('section').querySelectorAll('.x-content-switcher_content')    
                } else {
                    contentSwitchers = container.querySelectorAll(contentSwitcherSelector + ' .x-content-switcher_content')
                }
        
                const toggleID = event.target.closest('.x-toggle-switch').getAttribute('data-script-id');

                toggleSwitch.dispatchEvent(new Event('x_toggle_switch:toggled_' + labelIndex))
        
                contentSwitchers.forEach((contentSwitcher) => {
        
                    if ( contentSwitcher.classList.contains( 'x-content-switcher_toggled' ) ) {
                        contentSwitcher.classList.remove( 'x-content-switcher_toggled' )
                    } else {
                        contentSwitcher.setAttribute( 'data-x-switcher', labelIndex + '_' + toggleID )
                    }
        
                })

            })

            positionToggleSlider(toggleSwitch.querySelector('.x-toggle-switch_multiple-slider'),toggleSwitch.querySelector('.x-toggle-switch_label-active') )
        }

        if ( toggleSwitch.querySelector('button.x-toggle-switch_label' ) ) {

            if (typeof(ResizeObserver) === 'function') {
                const resizeObserver = new ResizeObserver((entries) => {
                    for (const entry of entries) {
                        positionToggleSlider(toggleSwitch.querySelector('.x-toggle-switch_multiple-slider'),toggleSwitch.querySelector('.x-toggle-switch_label-active') )
                }
            });
            
            resizeObserver.observe(toggleSwitch.querySelector('.x-toggle-switch_labels'), { box: 'border-box' });

        }

        }

    })

    }

    extrasToggleSwitch(document);

    function xToggleSwitchAjax(e) {

        if (typeof e.detail.queryId === 'undefined') {
            return;
        }

        if ( document.querySelector('.brxe-' + e.detail.queryId) ) {
            extrasToggleSwitch(document.querySelector('.brxe-' + e.detail.queryId).parentElement);
        }
      }
      
      document.addEventListener("bricks/ajax/load_page/completed", xToggleSwitchAjax)
      document.addEventListener("bricks/ajax/pagination/completed", xToggleSwitchAjax)

    // Expose function
    window.doExtrasToggleSwitch = extrasToggleSwitch;

}


document.addEventListener("DOMContentLoaded",function(e){

    if ( document.querySelector('body > .brx-body.iframe') ) {
        return
    }

    bricksIsFrontend&&xToggleSwitch()

  });