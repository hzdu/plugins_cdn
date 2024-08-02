/** Mail Chimp */
document.addEventListener("DOMContentLoaded", (event) => {
    tpmailchmp(document);
});

function tpmailchmp(doc){
    let mailchimpWrapper = doc.querySelectorAll('.tpgb-mailchimp-form');
    if(mailchimpWrapper.length > 0){
        mailchimpWrapper.forEach((self) => {
            var thisform = self,
                notverify = '<span class="loading-spinner"><i class="fa fa-times-circle-o" aria-hidden="true"></i></span>Error : API Key or List ID invalid. Please check that again in Plugin Settings.';
            thisform.addEventListener('submit', event => {
                event.preventDefault();
                var mailchimpform = thisform;
                var uid = `.tpgb-mail-${mailchimpform.getAttribute('data-id')}`;
                var MailOpt = JSON.parse(mailchimpform.getAttribute('data-mail-option'));
                let notification = document.querySelector(`${uid} .tpgb-notification`);
                    notification.classList.remove('not-verify','danger-msg','success-msg');
                    notification.style.cssText = "display:block; opacity:1";
                let subscribe = notification.querySelector('.subscribe-response');
                subscribe.innerHTML = MailOpt.loading;
                
                const mailAjax = new XMLHttpRequest();
                mailAjax.onload = function() {
                    if (mailAjax.status >= 200 && mailAjax.status < 400 && mailAjax.response) {
                        let resData = mailAjax.response;
                        if(resData=='please-check'){
                            notification.classList.add('not-verify');
                            let text = '<span class="loading-spinner"><i class="fa fa-times-circle-o" aria-hidden="true"></i></span>Error : '+MailOpt.gdprerrorMsg+' ';
                            subscribe.innerHTML = text;
                        }
                        if(resData=='not-verify'){
                            notification.classList.add('not-verify');
                            subscribe.innerHTML = notverify;
                        }
                        if(resData=='incorrect'){
                            notification.classList.add('danger-msg');
                            subscribe.innerHTML = MailOpt.incorrect;
                        }
                        if(resData=='pending'){
                            notification.classList.add('success-msg');
                            subscribe.innerHTML = MailOpt.pending;
                            let uId = document.querySelector(uid);
                            if(uId.getAttribute('data-thank-you')!= undefined && uId.getAttribute('data-thank-you')!=''){
                                var redirect_url=uId.getAttribute('data-thank-you');
                                setTimeout(function(){
                                    window.location.href = redirect_url;
                                }, 700);
                            }
                        }
                        if(resData=='correct'){
                            notification.classList.add('success-msg');
                            subscribe.innerHTML = MailOpt.success;
                            let uId = document.querySelector(uid);
                            if(uId.getAttribute('data-thank-you')!= undefined && uId.getAttribute('data-thank-you')!=''){
                                var redirect_url=uId.getAttribute('data-thank-you');
                                setTimeout(function(){
                                    window.location.href = redirect_url;
                                }, 700);
                            }
                        }
                        setTimeout(function(){
                            notification.style.cssText = "display:none; opacity:0";
                        },2500);
                    }
                }
                let dataa = new FormData(mailchimpform),
                    datastring = new URLSearchParams(dataa).toString();
                mailAjax.open('POST',(tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl);
                mailAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
                mailAjax.send(datastring);
            });
        });
    }
}
