/**
 * Event Tracker
 */
/*Google Tracking*/
if(trackerVar && trackerVar.google_track){
    var gtagSc = document.createElement('script');
    gtagSc.src = 'https://www.googletagmanager.com/gtag/js?id='+trackerVar.google_track;
    gtagSc.async = true;
    gtagSc.onload = function() {
        var gtagScNew = document.createElement('script');
        gtagScNew.innerHTML = 'window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag("js", new Date()); gtag("config", trackerVar.google_track, { "debug_mode":true });';
        document.head.appendChild(gtagScNew);  
    };
    document.head.appendChild(gtagSc);    
}

/*Facebook Tracking*/
if(trackerVar && trackerVar.facebook_track){
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', trackerVar.facebook_track);
    fbq('track', 'PageView');
}

/***Custom Events and Properties*/
document.addEventListener('DOMContentLoaded', ()=>{
    tpevTrack(document)
})

function tpevTrack(doc){
    let getAllElement = doc.querySelectorAll('.tpgb-event-tracker');

    if(getAllElement){
        getAllElement.forEach((evt)=>{
            let gEventEl = evt.querySelector('.tpgb-event-tracker-inner');
            let aEvtAttr = JSON.parse(gEventEl.getAttribute('data-event-opt'));

            /*Target all link tags*/
            let innerAtag = gEventEl.querySelectorAll('a');
            if(innerAtag){
                innerAtag.forEach((aEl)=>{
                    aEl.addEventListener('click', ()=>{
                        eventGFLoad(aEvtAttr);
                    });
                })
            }
            /* Target Video Play Button */
            let innerVideo = gEventEl.querySelector('.tpgb-video-play-btn');
            if(innerVideo){
                innerVideo.addEventListener('click', ()=>{
                    eventGFLoad(aEvtAttr);
                });
            }
            /* Target Mailchimp Button */
            let innerMailC = gEventEl.querySelector('.subscribe-btn-submit');
            if(innerMailC){
                innerMailC.addEventListener('click', ()=>{
                    eventGFLoad(aEvtAttr);
                });
            }
            /* Target WP forms Button */
            let innerWPform = gEventEl.querySelector('.wpforms-submit');
            if(innerWPform){
                innerWPform.addEventListener('click', ()=>{
                    eventGFLoad(aEvtAttr);
                });
            }
            /* Target Everest Form Button */
            let innerEverest = gEventEl.querySelector('.everest-forms-submit-button');
            if(innerEverest){
                innerEverest.addEventListener('click', ()=>{
                    eventGFLoad(aEvtAttr);
                });
            }
            /* Target CF7 Button */
            let innerCF7 = gEventEl.querySelector('.wpcf7-submit');
            if(innerCF7){
                innerCF7.addEventListener('click', ()=>{
                    eventGFLoad(aEvtAttr);
                });
            }
        });
    }
}

function eventGFLoad(aEvtAttr){
    /**Google*/
    if(aEvtAttr && aEvtAttr.google){
        if(typeof(gtag) === 'function'){
            let eProps = aEvtAttr.eventProperties,
            myObject = {};
            if(eProps){
                eProps.forEach((key)=>{
                    myObject = Object.assign({}, key, myObject);
                });
            }
            if(aEvtAttr.gglEventType && aEvtAttr.gglEventType=='recommended'){
                gtag('event', aEvtAttr.gglSelEvent, myObject);
            }else{
                gtag('event', aEvtAttr.gCsmEventName, myObject);
            }
        }else{
            console.log('Error : Google event, gtag is not defined');
        }
    }

    /**Facebook*/
    if(aEvtAttr && aEvtAttr.facebook){
        if(typeof(fbq) === 'function'){
            let fbCEName =  (aEvtAttr.fbCsmEventName) ? aEvtAttr.fbCsmEventName : 'Custom';
            if(aEvtAttr.fbEventType=='Custom'){
                fbq('trackCustom', fbCEName);
            }else{
                fbq('track', aEvtAttr.fbEventType);
            }
        }else{
            console.log('Error : Facebook event, fbq is not defined');
        }
    }
}