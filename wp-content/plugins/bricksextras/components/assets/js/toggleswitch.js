
function xToggleSwitch(){

    function positionToggleSlider(toggleSlider,activeLabel) {

        if ( toggleSlider ) {

            toggleSlider.style.left = activeLabel.offsetLeft + "px",
            toggleSlider.style.width = activeLabel.offsetWidth + 1 +"px",
            toggleSlider.style.height = activeLabel.offsetHeight + 1 + "px"

        }

    }
  
    document.querySelectorAll(".x-toggle-switch").forEach((toggleSwitch) => {

        const configAttr = toggleSwitch.getAttribute('data-x-switch')
        const elementConfig = configAttr ? JSON.parse(configAttr) : {}

        let contentSwitcherSelector = 'section' === elementConfig.contentSwitcher ? false : elementConfig.contentSwitcher,
            contentSwitchers    

            
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
                    contentSwitchers = document.querySelectorAll(contentSwitcherSelector + ' .x-content-switcher_content')
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

            toggleSwitch.addEventListener('click', (event) => {

                if (!event.target || !event.target.className == 'x-toggle-switch_label' || 'BUTTON' !== event.target.tagName ) {
                    return
                }

                toggleSwitch.dispatchEvent(new Event('x_toggle_switch:change'))
        
                const parentSwitch = event.target.closest('.x-toggle-switch_labels')
                for (const child of parentSwitch.children) {
        
                    if ( child.classList.contains('x-toggle-switch_label') ) {
                        child.classList.remove('x-toggle-switch_label-active')
                    }
                }
        
                event.target.classList.add('x-toggle-switch_label-active')
        
                positionToggleSlider(parentSwitch.parentNode.querySelector('.x-toggle-switch_multiple-slider'),event.target)
        
        
                let labelIndex = Array.prototype.indexOf.call(event.target.parentNode.children, event.target) + 1;

                if ( document.querySelector('body > .brx-body.iframe') ) {
                    return
                }
                
                if (!contentSwitcherSelector) {
                    contentSwitchers = event.target.closest('section').querySelectorAll('.x-content-switcher_content')    
                } else {
                    contentSwitchers = document.querySelectorAll(contentSwitcherSelector + ' .x-content-switcher_content')
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


document.addEventListener("DOMContentLoaded",function(e){

    if ( document.querySelector('body > .brx-body.iframe') ) {
        return
    }

    bricksIsFrontend&&xToggleSwitch()

  });