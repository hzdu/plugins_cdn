function xCopyToClipboardPopover(){

    const extrasCopyToClipboardPopover = function ( container ) {

        container.querySelectorAll('.brxe-xcopytoclipboard[data-x-tooltip]').forEach( copytoclipboard => {

            const configAttr = copytoclipboard.getAttribute('data-x-copy-to-clipboard')
            const config = configAttr ? JSON.parse(configAttr) : {}

            let tippyProps, tippyEl;

            const content = config.copyText

                if ( document.querySelector('body > .brx-body.iframe') ) {

                    tippyEl = copytoclipboard.querySelector('button')
                    tippyProps = {
                        render(instance) {
                            const popper = copytoclipboard.querySelector('[data-tippy-root]');
                            return {
                                popper,
                            };
                        },
                        allowHTML: true,     
                        interactive: true, 
                        arrow: true,
                        trigger: 'click',
                        appendTo: copytoclipboard.querySelector('.x-copy-tooltip-content'), 
                        placement: config.placement,
                        maxWidth: 'none',    
                        animation: 'extras',
                        theme: 'extras',     
                        touch: true, 
                        offset: [ config.offsetSkidding , config.offsetDistance], 
                        
                    }

                } else {

                    tippyEl = copytoclipboard.querySelector('button')
                    tippyProps = {
                        content: content, 
                        allowHTML: true,     
                        interactive: true, 
                        arrow: true,
                        trigger: config.tooltipReveal,
                        appendTo: copytoclipboard,
                        placement: config.placement,
                        maxWidth: 'none',    
                        animation: 'extras',
                        theme: 'extras',     
                        touch: true, 
                        interactiveDebounce: 50,
                        followCursor: 'false' === config.followCursor ? false : config.followCursor,
                        delay: config.delay,
                        offset: [ config.offsetSkidding , config.offsetDistance], 
                    };
                }  

                let xTippyInstance = tippy(tippyEl,tippyProps);
                window.xTippy.Instances[copytoclipboard.dataset.xId] = xTippyInstance;

                copytoclipboard.addEventListener('x_copy:copied', () => {
                    xTippyInstance.setContent(config.copiedText)
                    if ('manual' === config.tooltipReveal) {
                        xTippyInstance.show()
                    }
                })

                copytoclipboard.addEventListener('x_copy:reset', () => {
                    xTippyInstance.hide()
                    xTippyInstance.setContent(config.copyText)
                })



        })

    }

    extrasCopyToClipboardPopover(document);

    function xCopyToClipboardPopoverAjax(e) {

        if (typeof e.detail.queryId === 'undefined') {
            return;
        }

        if ( document.querySelector('.brxe-' + e.detail.queryId) ) {
            extrasCopyToClipboardPopover(document.querySelector('.brxe-' + e.detail.queryId).parentElement);
        }
   }
   
   document.addEventListener("bricks/ajax/load_page/completed", xCopyToClipboardPopoverAjax)
   document.addEventListener("bricks/ajax/pagination/completed", xCopyToClipboardPopoverAjax)

    // Expose function
    window.doExtrasCopyToClipBoardPopover = extrasCopyToClipboardPopover;

}

document.addEventListener("DOMContentLoaded",function(e){
    bricksIsFrontend&&xCopyToClipboardPopover()
})
