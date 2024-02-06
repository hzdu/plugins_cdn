function xSocialShare() {

    if ( document.querySelector('body > .brx-body.iframe') ) {
        return
    }

    const extrasSocialShare = function ( container ) {

        container.querySelectorAll(".brxe-xsocialshare").forEach((socialShare) => {

            let socialWidth = 600;
            let socialHeight = 600;
            
            let leftPosition = (window.screen.width / 2) - ((socialWidth / 2) + 10);
            let topPosition = (window.screen.height / 2) - ((socialHeight / 2) + 50);
            let windowFeatures = "width="+ socialWidth +",height="+ socialHeight +",scrollbars=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,location=no,directories=no";

            const maybePopup = 'true' === socialShare.getAttribute('data-x-popup');

            if ( maybePopup ) {

                socialShare.querySelectorAll(".x-social-share_link:not(.email):not(.print):not(.copy):not(.mastodon)").forEach((link) => {

                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.open(
                            link.getAttribute('href'),
                            "popupWindow",
                            windowFeatures
                        );
                    })

                })

            }

            socialShare.querySelectorAll(".x-social-share_link.mastodon").forEach((link) => {

                link.addEventListener('click', (e) => {

                    e.preventDefault();

                    // Gather the source text and URL
                    let src = e.currentTarget.getAttribute("data-src");

                    // Gather the Mastodon domain
                    let domain = prompt("Enter your Mastodon domain", "");

                    if (domain == "" || domain == null){
                        return;
                    }

                    if ( domain.endsWith('/') ) {
                        domain = domain.slice(0, -1)
                    }

                    if (domain.startsWith('https://')) {
                        domain = domain.slice('https://'.length);
                    }

                    // Build the URL
                    let url = "https://" + domain + "/share?text=" + src;

                    if ( maybePopup ) {
                        window.open( 
                            url,
                            "popupWindow",
                            windowFeatures
                        );
                    } else {
                        window.open(url, '_blank');
                    }

                })

            })

            socialShare.querySelectorAll(".x-social-share_link.copy").forEach((copyLink) => {

                copyLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    if ( null != navigator.clipboard ) {
                        navigator.clipboard.writeText(copyLink.getAttribute('href')).then(() => {
                            if ( copyLink.querySelector('.x-social-share_label' ) && '' != copyLink.dataset.copiedLabel ) {
                                copyLink.querySelector('.x-social-share_label' ).innerHTML = copyLink.dataset.copiedLabel
                            }
                        }, () => {
                            console.log('BricksExtras: Copy to clipboard failed. This feature is available only in with HTTPS')
                        });
                    } else {
                        console.log('BricksExtras: Copy to clipboard failed. This feature is available only in with HTTPS')
                    }
                })

            })

        })

    }

    extrasSocialShare(document);

    function xSocialShareAjax(e) {

        if (typeof e.detail.queryId === 'undefined') {
            return;
        }

        if ( document.querySelector('.brxe-' + e.detail.queryId) ) {
            extrasSocialShare(document.querySelector('.brxe-' + e.detail.queryId).parentElement);
        }
      }
      
      document.addEventListener("bricks/ajax/load_page/completed", xSocialShareAjax)
      document.addEventListener("bricks/ajax/pagination/completed", xSocialShareAjax)

    // Expose function
    window.doExtrasSocialShare = extrasSocialShare;

}

document.addEventListener("DOMContentLoaded",function(e){
    bricksIsFrontend&&xSocialShare()
});